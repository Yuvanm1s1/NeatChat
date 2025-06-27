# image_moderator.py

from transformers import CLIPProcessor, CLIPModel, ViTForImageClassification, ViTFeatureExtractor
from PIL import Image, ImageFilter
import torch
import cv2

class ImageContentModerator:
    def __init__(self, nsfw_threshold=0.85, blur_radius=99):
        # NSFW Setup
        self.nsfw_threshold = nsfw_threshold
        self.nsfw_classes = [
            "porn", "nudity", "sexual activity", "explicit", 
            "safe", "neutral", "hentai", "suggestive", "drawing"
        ]
        self.nsfw_model = CLIPModel.from_pretrained("openai/clip-vit-base-patch16")
        self.nsfw_processor = CLIPProcessor.from_pretrained("openai/clip-vit-base-patch16")

        # Violence Setup
        self.violence_model = ViTForImageClassification.from_pretrained('jaranohaal/vit-base-violence-detection')
        self.violence_extractor = ViTFeatureExtractor.from_pretrained('jaranohaal/vit-base-violence-detection')
        self.custom_labels = {1: "Non-Violent", 0: "Violent"}

        self.blur_radius = blur_radius

        print("[Moderator] Both models loaded successfully.")

    def is_nsfw(self, image):
        inputs = self.nsfw_processor(text=self.nsfw_classes, images=image, return_tensors="pt", padding=True)
        with torch.no_grad():
            outputs = self.nsfw_model(**inputs)
            probs = outputs.logits_per_image.softmax(dim=1)[0]
        top_class = self.nsfw_classes[probs.argmax()]
        confidence = probs.max().item()
        print(f"[NSFW] Predicted: {top_class} ({confidence:.2f})")
        return top_class not in ['safe', 'neutral', 'drawing'] and confidence > self.nsfw_threshold

    def is_violent(self, image):
        inputs = self.violence_extractor(images=image, return_tensors="pt")
        with torch.no_grad():
            outputs = self.violence_model(**inputs)
            class_idx = outputs.logits.argmax(-1).item()
            label = self.custom_labels[class_idx]
        print(f"[Violence] Predicted: {label}")
        return label == "Violent"

    def blur_image(self, image_path, output_path):
        image = Image.open(image_path)
        blurred = image.filter(ImageFilter.GaussianBlur(radius=self.blur_radius))
        blurred.save(output_path)
        return output_path

    def process_image(self, image_path, output_path="moderated_image.jpg"):
        image = Image.open(image_path).convert("RGB")

        if self.is_nsfw(image):
            print("⚠️ NSFW Content Detected — Blurring Image")
            return self.blur_image(image_path, output_path)

        if self.is_violent(image):
            print("⚠️ Violent Content Detected — Blurring Image")
            return self.blur_image(image_path, output_path)

        print("✅ Image is clean — No action taken")
        image.save(output_path)
        return output_path
from transformers import pipeline
from better_profanity import profanity

# Load profanity model
toxic_classifier = pipeline("text-classification", model="unitary/toxic-bert")
profanity.load_censor_words()
custom_words = [
    "idiot", "moron", "dumb", "stupid", "loser", "bastard", "retard", "scumbag",
    "asshole", "jerk", "shit", "fuck", "damn", "hell", "crap", "bitch"
]
profanity.add_censor_words(custom_words)

def mask_bad_words(text):
    return profanity.censor(text)

def smart_censor(text, toxic_threshold=0.85):
    result = toxic_classifier(text)[0]
    label = result['label'].lower()
    score = result['score']

    if label == "toxic" and score > toxic_threshold:
        masked_text = mask_bad_words(text)
        if masked_text != text:
            return masked_text
        else:
            return "⚠️ Vulgar Content Detected"
    
    return text
