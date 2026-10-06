"""
record_admin.py
Script ADMIN - chạy rời, không cần web.
Mở webcam, chạy trong N giây, lưu khuôn mặt mới + thời điểm xuất hiện vào dataset/.

Cách chạy:
    python record_admin.py --duration 300
    (mặc định 300 giây = 5 phút nếu không truyền tham số)
"""

import argparse
import time
import os
import numpy as np
import cv2

from face_engine import detect_and_embed
from matcher import load_dataset, save_dataset, find_best_match, now_iso, MATCH_THRESHOLD, IMAGES_DIR

FRAME_SAMPLE_INTERVAL = 0.5     # giây - cứ 0.5s mới xử lý 1 frame (2 FPS), đỡ tốn CPU
MIN_RESIGHT_INTERVAL = 30       # giây - không ghi thêm sighting nếu vừa thấy người đó < 30s trước


def main(duration_seconds: int):
    embeddings, meta = load_dataset()
    print(f"Dataset hiện có {len(meta)} khuôn mặt đã biết.")

    cap = cv2.VideoCapture(0)
    if not cap.isOpened():
        raise RuntimeError("Không mở được webcam - kiểm tra lại camera có đang bị app khác chiếm dụng không.")

    start_time = time.time()
    last_process_time = 0.0

    print(f"Bắt đầu ghi trong {duration_seconds} giây... Nhấn Ctrl+C để dừng sớm.")

    try:
        while time.time() - start_time < duration_seconds:
            ret, frame = cap.read()
            if not ret:
                continue  # bỏ qua frame lỗi, không dừng cả script

            now = time.time()
            if now - last_process_time < FRAME_SAMPLE_INTERVAL:
                continue  # chưa tới lúc xử lý frame tiếp theo -> bỏ qua, tiết kiệm CPU
            last_process_time = now

            faces = detect_and_embed(frame)

            for face in faces:
                embedding = face["embedding"]
                best_index, best_score = find_best_match(embedding, embeddings)

                if best_index is not None and best_score >= MATCH_THRESHOLD:
                    # Đã từng thấy người này -> kiểm tra có phải "gặp lại quá gần" không
                    last_seen_str = meta[best_index]["last_seen"]
                    last_seen_ts = time.mktime(time.strptime(last_seen_str, "%Y-%m-%dT%H:%M:%S"))

                    if now - last_seen_ts < MIN_RESIGHT_INTERVAL:
                        continue  # vừa mới ghi nhận gần đây rồi, bỏ qua để tránh spam

                    # Ghi thêm 1 sighting mới cho face đã có
                    face_id = meta[best_index]["face_id"]
                    img_path = os.path.join(IMAGES_DIR, f"face_{face_id}_{int(now)}.jpg")
                    cv2.imwrite(img_path, frame)

                    meta[best_index]["last_seen"] = now_iso()
                    meta[best_index]["sightings"].append({
                        "timestamp": now_iso(),
                        "image_path": img_path,
                    })
                    print(f"[Sighting] face_id={face_id} lúc {now_iso()} (score={best_score:.3f})")

                else:
                    # Chưa từng thấy -> tạo face mới
                    new_face_id = len(meta)
                    img_path = os.path.join(IMAGES_DIR, f"face_{new_face_id}_{int(now)}.jpg")
                    cv2.imwrite(img_path, frame)

                    embeddings = np.vstack([embeddings, embedding[np.newaxis, :]])
                    meta.append({
                        "face_id": new_face_id,
                        "representative_image": img_path,
                        "first_seen": now_iso(),
                        "last_seen": now_iso(),
                        "sightings": [{"timestamp": now_iso(), "image_path": img_path}],
                    })
                    print(f"[Mặt mới] face_id={new_face_id} lúc {now_iso()} (det_score={face['det_score']:.3f})")

    except KeyboardInterrupt:
        print("Dừng sớm theo yêu cầu (Ctrl+C).")

    finally:
        cap.release()
        save_dataset(embeddings, meta)
        print(f"Đã lưu dataset: {len(meta)} khuôn mặt, tổng {sum(len(m['sightings']) for m in meta)} lượt xuất hiện.")


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--duration", type=int, default=300, help="Thời gian ghi (giây), mặc định 300")
    args = parser.parse_args()

    main(args.duration)
