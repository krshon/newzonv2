import torch

checkpoint_path = torch.hub.download_url_to_file(
    "https://storage.googleapis.com/timesfm/checkpoints/timesfm-1.0-200m.tar",
    "timesfm-1.0-200m.tar"
)
print("✅ Pretrained checkpoint downloaded:", checkpoint_path)
