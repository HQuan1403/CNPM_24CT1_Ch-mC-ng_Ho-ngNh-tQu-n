"""
matcher.py
Quản lý dataset dạng file (embeddings.npy + meta.json) và logic so khớp.
Dùng chung cho record_admin.py (ghi) và app_user.py (đọc/tra cứu).
"""

import json
import os
import sqlite3
import numpy as np
from datetime import datetime

DATASET_DIR = "dataset"
EMB_PATH = os.path.join(DATASET_DIR, "embeddings.npy")
META_PATH = os.path.join(DATASET_DIR, "meta.json")
IMAGES_DIR = os.path.join(DATASET_DIR, "images")
DB_PATH = os.path.join(DATASET_DIR, "database.db")  # SQLite: bảng faces + sightings

SCHEMA = """
CREATE TABLE IF NOT EXISTS faces (
    face_id INTEGER PRIMARY KEY AUTOINCREMENT,
    embedding BLOB NOT NULL,
    representative_image TEXT NOT NULL,
    first_seen TEXT NOT NULL,
    last_seen TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS sightings (
    sighting_id INTEGER PRIMARY KEY AUTOINCREMENT,
    face_id INTEGER NOT NULL REFERENCES faces(face_id),
    image_path TEXT NOT NULL,
    timestamp TEXT NOT NULL
);
"""

MATCH_THRESHOLD = 0.5  # ngưỡng cosine similarity để coi là "cùng 1 người" - sẽ tinh chỉnh lại sau khi test thực tế


def _connect():
    """Mở kết nối SQLite và đảm bảo schema (faces, sightings) tồn tại."""
    os.makedirs(IMAGES_DIR, exist_ok=True)  # đảm bảo thư mục tồn tại ngay cả lần đầu
    conn = sqlite3.connect(DB_PATH)
    conn.execute("PRAGMA foreign_keys = ON")
    conn.executescript(SCHEMA)
    return conn


def load_dataset():
    """
    Đọc dataset từ SQLite. Nếu chưa có dữ liệu -> trả về rỗng.
    Trả về: (embeddings: np.ndarray shape (N, 512), meta: list[dict])
    meta[i] tương ứng với embeddings[i] (index phải luôn khớp nhau).
    """
    conn = _connect()
    try:
        faces = conn.execute(
            "SELECT face_id, embedding, representative_image, first_seen, last_seen "
            "FROM faces ORDER BY face_id"
        ).fetchall()
        sightings = {}
        for face_id, image_path, timestamp in conn.execute(
            "SELECT face_id, image_path, timestamp FROM sightings ORDER BY sighting_id"
        ):
            sightings.setdefault(face_id, []).append(
                {"timestamp": timestamp, "image_path": image_path}
            )
    finally:
        conn.close()

    if not faces:
        return np.zeros((0, 512), dtype=np.float32), []

    embeddings = np.stack(
        [np.frombuffer(row[1], dtype=np.float32) for row in faces]
    ).astype(np.float32)
    meta = [
        {
            "face_id": row[0],
            "representative_image": row[2],
            "first_seen": row[3],
            "last_seen": row[4],
            "sightings": sightings.get(row[0], []),
        }
        for row in faces
    ]
    return embeddings, meta


def save_dataset(embeddings: np.ndarray, meta: list[dict]):
    """Ghi đè toàn bộ dataset xuống SQLite (xoá hết rồi insert lại trong 1 transaction)."""
    conn = _connect()
    try:
        with conn:  # commit nếu thành công, rollback nếu lỗi
            conn.execute("DELETE FROM sightings")
            conn.execute("DELETE FROM faces")
            for emb, m in zip(embeddings, meta):
                conn.execute(
                    "INSERT INTO faces (face_id, embedding, representative_image, first_seen, last_seen) "
                    "VALUES (?, ?, ?, ?, ?)",
                    (
                        m["face_id"],
                        np.asarray(emb, dtype=np.float32).tobytes(),
                        m["representative_image"],
                        m["first_seen"],
                        m["last_seen"],
                    ),
                )
                conn.executemany(
                    "INSERT INTO sightings (face_id, image_path, timestamp) VALUES (?, ?, ?)",
                    [(m["face_id"], s["image_path"], s["timestamp"]) for s in m.get("sightings", [])],
                )
    finally:
        conn.close()


def find_best_match(embedding: np.ndarray, embeddings: np.ndarray):
    """
    So 1 embedding mới với toàn bộ embeddings đã lưu.
    Vì embedding đã được L2-normalize sẵn (từ face_engine) -> cosine similarity = dot product đơn giản.
    Trả về: (best_index, best_score). Nếu dataset rỗng -> (None, 0.0)
    """
    if len(embeddings) == 0:
        return None, 0.0

    scores = embeddings @ embedding  # dot product hàng loạt: (N, 512) @ (512,) -> (N,)
    best_index = int(np.argmax(scores))
    best_score = float(scores[best_index])
    return best_index, best_score


def now_iso():
    """Timestamp chuẩn ISO, dùng thống nhất ở mọi nơi (record_admin.py và app_user.py)."""
    return datetime.now().isoformat(timespec="seconds")
