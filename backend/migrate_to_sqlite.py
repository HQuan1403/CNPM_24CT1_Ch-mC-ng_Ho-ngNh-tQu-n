"""
migrate_to_sqlite.py
Chạy 1 lần: import dataset/embeddings.npy + dataset/meta.json cũ vào dataset/database.db.
Sau khi kiểm tra đúng có thể xoá 2 file cũ.
"""

import json
import os
import sys
import numpy as np

import matcher


def main():
    sys.stdout.reconfigure(encoding="utf-8")  # tránh lỗi in tiếng Việt trên console Windows
    if not (os.path.exists(matcher.EMB_PATH) and os.path.exists(matcher.META_PATH)):
        print("Không tìm thấy embeddings.npy / meta.json -> không có gì để migrate.")
        return

    embeddings = np.load(matcher.EMB_PATH).astype(np.float32)
    with open(matcher.META_PATH, "r", encoding="utf-8") as f:
        meta = json.load(f)

    if len(embeddings) != len(meta):
        raise SystemExit(f"Dữ liệu lệch: {len(embeddings)} embeddings vs {len(meta)} meta.")

    existing, _ = matcher.load_dataset()
    if len(existing) > 0:
        raise SystemExit("database.db đã có dữ liệu; huỷ để tránh ghi đè.")

    matcher.save_dataset(embeddings, meta)

    check_emb, check_meta = matcher.load_dataset()
    ok = (
        check_emb.shape == embeddings.shape
        and np.array_equal(check_emb, embeddings)
        and check_meta == meta
    )
    if not ok:
        raise SystemExit("Kiểm tra sau migrate thất bại, KHÔNG xoá file cũ.")

    print(f"Đã migrate {len(meta)} khuôn mặt vào {matcher.DB_PATH}.")
    ans = input("Xoá embeddings.npy và meta.json cũ? [y/N] ").strip().lower()
    if ans == "y":
        os.remove(matcher.EMB_PATH)
        os.remove(matcher.META_PATH)
        print("Đã xoá file cũ.")


if __name__ == "__main__":
    main()
