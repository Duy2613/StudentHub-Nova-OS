import os
from google import genai
from google.genai import types

# Lấy API Key miễn phí từ Google AI Studio của bạn
gemini_key = os.environ.get("GEMINI_API_KEY")
if not gemini_key:
    raise ValueError("Vui l�ng c?u h�nh bi?n m�i tru?ng GEMINI_API_KEY tru?c khi ch?y script n�y.")
client = genai.Client(api_key=gemini_key)

OUTPUT_DIR = "public/assets/images"
os.makedirs(OUTPUT_DIR, exist_ok=True)

# Trọn bộ 8 Prompts chuẩn 1:1 theo video why.zero.university cho Nano Banana 2 Lite
PROMPTS = {
    "scene1_utopia_hands.png": (
        "3D web design hero scene inspired by why.zero.university. Ethereal bright white and soft emerald green paradise with classical marble pillars, pond, and falling pink petals. "
        "In the center, a glowing translucent green 3D holographic AI hand on the left reaches toward a realistic human hand on the right. "
        "Elegant dark green calligraphy serif text on top left says 'Firewall would' and bottom right says 'keep You SAFE'. 16:9 aspect ratio, Octane render, 8k."
    ),
    "scene2_red_bullshit_hand.png": (
        "Dramatic 3D web design scene. Deep crimson red background with vertical glowing red light beams and shattered black glass frame around the edges. "
        "A realistic 3D stone and human hand reaching straight up in the center. "
        "Large bold white typography overlaid in the center reading 'That\\'s Vulnerable*' with 'That\\'s' in elegant italic serif calligraphy. 16:9 aspect ratio."
    ),
    "scene2_glass_shards_stats.png": (
        "3D floating shattered glass shards in a dark crimson red void with chromatic aberration and rainbow light refraction on the glass edges. "
        "Inside the largest glass shard is crisp white serif typography reading '73% Breaches bypass single-layer security' and another shard below reading '90% Lack 24/7 AI SOC monitoring'. "
        "Cinematic WebGL 3D render, 16:9 aspect ratio."
    ),
    "scene3_burning_paper_certificate.png": (
        "Dark moody 3D cyberspace scene. A vintage paper security certificate floating at an angle in the center, burning with bright glowing orange and emerald fire embers at the edges. "
        "Bottom left features clean white and italic calligraphy text reading 'Theory sells Paper'. 16:9 aspect ratio, photorealistic 3D render."
    ),
    "scene3_4layers_architecture.png": (
        "Dark emerald cyberspace with floating torn newspaper clippings and glowing 3D security shields arranged in 4 concentric rings representing 4-Layer Information Security: "
        "Layer 1 Local AI Force, Layer 2 24/7 SOC Monitoring, Layer 3 Independent Pentest Audit, Layer 4 National Cyber Threat Sharing. "
        "Glowing white calligraphy text in the center reading '4-Layer Defense'. 16:9 aspect ratio."
    ),
    "scene4_green_portal_taphold.png": (
        "Pitch black cyberspace background. In the center is a futuristic rotating 3D mechanical portal made of 4 concentric glowing malachite green and metallic silver rings. "
        "In the exact center is a glowing white circular button with the text 'TAP HOLD'. Left side text says 'and that\\'s Why' and right side says 'we had to Exist'. 16:9 aspect ratio."
    ),
    "scene4_clouds_introducing_novaos.png": (
        "Aerial view above bright white fluffy volumetric clouds parting in the middle to reveal a futuristic city below. "
        "In the center of the white sky is large futuristic cyan-blue gradient 3D sans-serif text reading 'NOVA OS' and above it elegant green calligraphy text reading 'Introducing StudentHub-AI'. 16:9 aspect ratio."
    ),
    "scene5_isometric_cyber_campus.png": (
        "Isometric 3D miniature architectural render of a futuristic smart campus and cybersecurity fortress city in bright daylight, exact style of why.zero.university city map. "
        "In the center is a futuristic white domed stadium covered by a glowing translucent green hologram dome with 3D text wrapping around it reading 'LAUNCH NOVA OS CORE'. "
        "Surrounding it are 4 modern tech buildings labeled 'LAYER 1 LOCAL AI', 'LAYER 2 SOC 24/7', 'LAYER 3 AUDIT LAB', and 'LAYER 4 NATIONAL GRID'. 16:9 aspect ratio, tilt-shift 3D render."
    )
}

print("🚀 Đang gọi model Nano Banana 2 Lite (gemini-3.1-flash-lite-image)...")

for filename, prompt in PROMPTS.items():
    print(f"⏳ Đang tạo: {filename} ...")
    response = client.models.generate_content(
        model="gemini-3.1-flash-lite-image", # Model Nano Banana 2 Lite chính thức
        contents=[prompt],
    )
    for part in response.parts:
        if part.inline_data is not None:
            img = part.as_image()
            filepath = os.path.join(OUTPUT_DIR, filename)
            img.save(filepath)
            print(f"✅ Đã lưu: {filepath}")

print("🎉 Hoàn tất trọn bộ ảnh 5 Scene bằng Nano Banana 2 Lite!")