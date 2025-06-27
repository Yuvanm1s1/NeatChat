# # from fastapi import FastAPI, UploadFile, File
# # from pydantic import BaseModel
# # from image_moderator import ImageContentModerator, smart_censor
# # from PIL import Image
# # import shutil
# # import os

# # app = FastAPI()

# # # Load models once when server starts
# # moderator = ImageContentModerator()

# # # Input schema for text
# # class TextRequest(BaseModel):
# #     text: str

# # @app.get("/")
# # def root():
# #     return {"message": "Chat Moderation API is running"}

# # @app.post("/moderate-text")
# # async def moderate_text(req: TextRequest):
# #     result = smart_censor(req.text)
# #     return {"moderated_text": result}

# # @app.post("/moderate-image")
# # async def moderate_image(file: UploadFile = File(...)):
# #     temp_path = f"temp_{file.filename}"

# #     # Save uploaded image to disk
# #     with open(temp_path, "wb") as buffer:
# #         shutil.copyfileobj(file.file, buffer)

# #     output_path = f"blurred_{file.filename}"
# #     moderated_path = moderator.process_image(temp_path, output_path)

# #     # Read the moderated image and return as base64
# #     with open(moderated_path, "rb") as img_file:
# #         image_bytes = img_file.read()
# #         import base64
# #         encoded_image = base64.b64encode(image_bytes).decode()

# #     # Clean up temp files
# #     os.remove(temp_path)
# #     os.remove(moderated_path)

# #     return {
# #         "blurred_image_base64": encoded_image
# #     }






from fastapi import FastAPI
from pydantic import BaseModel
from image_moderator import ImageContentModerator, smart_censor
from PIL import Image
import base64
import os

app = FastAPI()

# Load models once when server starts
moderator = ImageContentModerator()

# Schemas
class TextRequest(BaseModel):
    text: str

class ImageRequest(BaseModel):
    image: str  # base64 string

@app.get("/")
def root():
    return {"message": "Chat Moderation API is running"}
# ✅ IMAGE MODERATION ENDPOINT
@app.post("/moderate-image")
async def moderate_image(req: ImageRequest):
    try:
        # Decode base64 image
        image_data = base64.b64decode(req.image.split(",")[-1])
        temp_path = "temp_input.png"
        output_path = "temp_blurred.png"

        # Save temp image
        with open(temp_path, "wb") as f:
            f.write(image_data)

        # Process image
        moderated_path = moderator.process_image(temp_path, output_path)

        # Encode result
        with open(moderated_path, "rb") as f:
            encoded = base64.b64encode(f.read()).decode()

        # Cleanup
        os.remove(temp_path)
        os.remove(output_path)

        return {"blurred_image_base64": encoded}
    except Exception as e:
        return {"error": str(e)}
# ✅ TEXT MODERATION ENDPOINT
@app.post("/moderate-text")
async def moderate_text(req: TextRequest):
    try:
        result = smart_censor(req.text)
        return {"moderated_text": result}
    except Exception as e:
        return {"error": str(e)}


