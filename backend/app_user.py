"""
app_user.py
Trang USER - web nhẹ để tra cứu.
Chạy: uvicorn app_user:app --reload
Rồi mở trình duyệt: http://127.0.0.1:8000
"""

import os
import numpy as np
import cv2
from fastapi import FastAPI, UploadFile, File
from fastapi.staticfiles import StaticFiles
from fastapi.responses import HTMLResponse

from face_engine import detect_and_embed
from matcher import load_dataset, find_best_match, MATCH_THRESHOLD, IMAGES_DIR

app = FastAPI()

# Phục vụ ảnh làm chứng qua URL tĩnh: dataset/images/xxx.jpg -> http://.../images/xxx.jpg
# Nhờ vậy JSON trả về chỉ cần link, không phải encode ảnh nặng vào JSON.
app.mount("/images", StaticFiles(directory=IMAGES_DIR), name="images")


@app.get("/", response_class=HTMLResponse)
def index():
    # Trang HTML tối giản: chọn ảnh -> gửi lên /verify -> hiển thị kết quả bằng JS.
    return """
    <!DOCTYPE html>
    <html lang="vi">
    <head><meta charset="utf-8"><title>Tra cứu khuôn mặt</title></head>
    <body style="font-family: sans-serif; max-width: 600px; margin: 40px auto;">
        <h2>Tra cứu khuôn mặt trong webcam</h2>
        <input type="file" id="fileInput" accept="image/*">
        <button onclick="verify()">Tra cứu</button>
        <div id="result" style="margin-top: 20px;"></div>

        <script>
        async function verify() {
            const fileInput = document.getElementById("fileInput");
            const resultDiv = document.getElementById("result");
            if (!fileInput.files.length) {
                resultDiv.innerText = "Bạn chưa chọn ảnh.";
                return;
            }
            resultDiv.innerText = "Đang xử lý...";

            const formData = new FormData();
            formData.append("file", fileInput.files[0]);

            const res = await fetch("/verify", { method: "POST", body: formData });
            const data = await res.json();

            if (!data.matched) {
                resultDiv.innerText = data.message;
                return;
            }

            let html = `<p>Đã tìm thấy! (face_id=${data.face_id})</p><ul>`;
            for (const a of data.appearances) {
                html += `<li>${a.timestamp} <br><img src="${a.evidence_image_url}" width="160"></li>`;
            }
            html += "</ul>";
            resultDiv.innerHTML = html;
        }
        </script>
    </body>
    </html>
    """


@app.post("/verify")
async def verify(file: UploadFile = File(...)):
    # Đọc file upload thành ảnh OpenCV (giống hệt định dạng mà face_engine đã quen xử lý ở record_admin.py)
    contents = await file.read()
    np_arr = np.frombuffer(contents, np.uint8)
    img = cv2.imdecode(np_arr, cv2.IMREAD_COLOR)

    if img is None:
        return {"matched": False, "message": "Không đọc được ảnh, thử ảnh khác."}

    faces = detect_and_embed(img)
    if not faces:
        return {"matched": False, "message": "Không tìm thấy khuôn mặt nào trong ảnh."}

    # Nếu ảnh có nhiều mặt (ví dụ ảnh nhóm) -> lấy mặt có det_score cao nhất (rõ/nét nhất)
    best_face = max(faces, key=lambda f: f["det_score"])
    embedding = best_face["embedding"]

    # Đọc lại dataset MỚI NHẤT từ đĩa - vì record_admin.py có thể vừa ghi thêm dữ liệu ở phiên khác
    embeddings, meta = load_dataset()
    best_index, best_score = find_best_match(embedding, embeddings)

    if best_index is None or best_score < MATCH_THRESHOLD:
        return {"matched": False, "message": "Người này không xuất hiện trong webcam."}

    person = meta[best_index]
    appearances = [
        {
            "timestamp": s["timestamp"],
            "evidence_image_url": f"/images/{os.path.basename(s['image_path'])}",
        }
        for s in person["sightings"]
    ]

    return {
        "matched": True,
        "face_id": person["face_id"],
        "match_score": round(best_score, 3),
        "appearances": appearances,
    }