"""Module dùng chung để phát hiện khuôn mặt và tạo vector đặc trưng."""

import numpy as np  # Thư viện xử lý mảng; dùng để khai báo kiểu ảnh đầu vào.
from insightface.app import FaceAnalysis  # Lớp InsightFace quản lý detector và model embedding.

# Tạo đối tượng model một lần khi module được import lần đầu.
# Các lần import sau thường dùng lại module đã được Python cache.
_app = FaceAnalysis(
    name="buffalo_l",  # Chọn bộ model buffalo_l để vector tương thích với dữ liệu cũ.
    providers=[
        "CUDAExecutionProvider",  # Ưu tiên chạy trên GPU thông qua CUDA.
        "CPUExecutionProvider",  # Dùng CPU dự phòng nếu CUDA không khả dụng.
    ],
)

# Chuẩn bị model trước khi nhận ảnh.
_app.prepare(
    ctx_id=0,  # Chọn thiết bị tính toán số 0, thường là GPU đầu tiên.
    det_size=(640, 640),  # Resize vùng xử lý detector về 640x640 để cân bằng tốc độ và độ chính xác.
)


def detect_and_embed(img_bgr: np.ndarray) -> list[dict]:
    """Phát hiện tất cả khuôn mặt trong ảnh và tạo embedding cho từng mặt."""
    faces = _app.get(img_bgr)  # Chạy detector và model embedding trên ảnh BGR đầu vào.

    results = []  # Tạo danh sách rỗng để chứa thông tin của từng khuôn mặt.
    for face in faces:
        # Chuyển thông tin Face InsightFace thành dict đơn giản để module khác dễ sử dụng.
        results.append({
            "bbox": face.bbox.astype(int).tolist(),  # Đổi tọa độ bbox sang số nguyên rồi thành list Python.
            "embedding": face.normed_embedding,  # Vector đã chuẩn hóa L2; cosine similarity có thể dùng dot product.
            "det_score": float(face.det_score),  # Đổi điểm tin cậy phát hiện sang kiểu float thông thường.
        })
    return results  # Trả về [] nếu không phát hiện được mặt nào.