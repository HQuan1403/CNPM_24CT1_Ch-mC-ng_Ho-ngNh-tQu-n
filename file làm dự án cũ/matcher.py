"""
matcher.py
Quản lý dataset dạng file (embeddings.npy + meta.json) và logic so khớp.
Dùng chung cho record_admin.py (ghi) và app_user.py (đọc/tra cứu).
"""

import json
import os
import numpy as np
from datetime import datetime

DATASET_DIR = "dataset"
EMB_PATH = os.path.join(DATASET_DIR, "embeddings.npy")
META_PATH = os.path.join(DATASET_DIR, "meta.json")
IMAGES_DIR = os.path.join(DATASET_DIR, "images")

MATCH_THRESHOLD = 0.5  # ngưỡng cosine similarity để coi là "cùng 1 người" - sẽ tinh chỉnh lại sau khi test thực tế


def load_dataset():
    """
    Đọc dataset từ đĩa. Nếu chưa tồn tại (lần chạy đầu tiên) -> trả về rỗng.
    Trả về: (embeddings: np.ndarray shape (N, 512), meta: list[dict])
    meta[i] tương ứng với embeddings[i] (index phải luôn khớp nhau).
    """
    os.makedirs(IMAGES_DIR, exist_ok=True)  # đảm bảo thư mục tồn tại ngay cả lần đầu

    if not os.path.exists(EMB_PATH) or not os.path.exists(META_PATH):
        return np.zeros((0, 512), dtype=np.float32), []

    embeddings = np.load(EMB_PATH)
    with open(META_PATH, "r", encoding="utf-8") as f:
        meta = json.load(f)
    return embeddings, meta


def save_dataset(embeddings: np.ndarray, meta: list[dict]):
    """Ghi đè toàn bộ dataset xuống đĩa. Gọi sau mỗi lần cập nhật (thêm face/sighting mới)."""
    np.save(EMB_PATH, embeddings)
    with open(META_PATH, "w", encoding="utf-8") as f:
        json.dump(meta, f, ensure_ascii=False, indent=2)


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
