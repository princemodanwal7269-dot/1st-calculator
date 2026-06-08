from ultralytics import YOLO
import cv2
import time

# Load AI model
model = YOLO("yolov8n.pt")

# Your phone camera URL (IMPORTANT: keep same as browser)
url = url = "http://24.24.24.208:8080/video"

cap = cv2.VideoCapture(url)

time.sleep(2)  # wait for camera to start

while True:
    ret, frame = cap.read()

    if not ret:
        print("Camera not connecting...")
        continue

    # AI detection
    results = model(frame)

    for r in results:
        for box in r.boxes:
            cls = int(box.cls[0])
            name = model.names[cls]

            if name == "person":
                print("👤 Human Detected!")

    cv2.imshow("AI Camera", frame)

    if cv2.waitKey(1) == 27:
        break

cap.release()
cv2.destroyAllWindows()