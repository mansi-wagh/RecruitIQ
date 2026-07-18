import os
import shutil
from app.config import SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, SUPABASE_BUCKET
from app.logger import logger

class StorageService:
    """
    Unified Storage Service supporting Supabase Storage with local filesystem fallback.
    """
    def __init__(self):
        self.enabled = bool(SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY)
        self.bucket = SUPABASE_BUCKET or "resumes"
        self.client = None
        
        if self.enabled:
            logger.info("Initializing Supabase Storage client.")
            try:
                from supabase import create_client
                self.client = create_client(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)
            except ImportError:
                logger.error("supabase-py SDK is not installed despite credentials being set. Falling back to local storage.")
                self.enabled = False
        else:
            logger.warning("Supabase Storage config is missing. Falling back to local filesystem storage.")

    def upload_file(self, file_body, object_name: str) -> str:
        """
        Uploads a file to Supabase storage. If disabled, saves to local storage.
        Returns the storage path (object_name) or local path.
        """
        if self.enabled:
            try:
                # Resolve content type based on extension
                ext = os.path.splitext(object_name)[1].lower()
                content_type = "application/pdf" if ext == ".pdf" else "application/octet-stream"
                if ext == ".docx":
                    content_type = "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                
                # Read file body to bytes
                if hasattr(file_body, "read"):
                    file_data = file_body.read()
                    if hasattr(file_body, "seek"):
                        file_body.seek(0)
                else:
                    file_data = file_body

                self.client.storage.from_(self.bucket).upload(
                    path=object_name,
                    file=file_data,
                    file_options={"content-type": content_type}
                )
                logger.info("Successfully uploaded %s to Supabase Storage", object_name)
                return object_name
            except Exception as e:
                logger.error("Failed to upload %s to Supabase: %s. Trying local fallback.", object_name, e)
        
        # Local fallback
        local_path = os.path.join("uploads", "resumes", object_name)
        os.makedirs(os.path.dirname(local_path), exist_ok=True)
        with open(local_path, "wb") as f:
            if hasattr(file_body, "read"):
                shutil.copyfileobj(file_body, f)
                file_body.seek(0)
            else:
                f.write(file_body)
        logger.info("Saved %s to local storage", local_path)
        return local_path

    def download_file(self, object_name: str, local_dest: str):
        """
        Downloads a file from Supabase storage to a local destination. If disabled, reads from local.
        """
        if self.enabled:
            try:
                res_bytes = self.client.storage.from_(self.bucket).download(object_name)
                os.makedirs(os.path.dirname(local_dest), exist_ok=True)
                with open(local_dest, "wb") as f:
                    f.write(res_bytes)
                logger.info("Downloaded %s from Supabase to %s", object_name, local_dest)
                return
            except Exception as e:
                logger.error("Failed to download %s from Supabase: %s. Trying local fallback.", object_name, e)

        # Local fallback
        local_src = object_name
        if not os.path.exists(local_src):
            local_src = os.path.join("uploads", "resumes", object_name)
            
        if os.path.exists(local_src):
            os.makedirs(os.path.dirname(local_dest), exist_ok=True)
            shutil.copyfile(local_src, local_dest)
            logger.info("Copied local file %s to %s", local_src, local_dest)
        else:
            raise FileNotFoundError(f"File not found locally or in Supabase: {object_name}")

    def delete_file(self, object_name: str):
        """
        Deletes a file from Supabase storage or local disk.
        """
        if self.enabled:
            try:
                self.client.storage.from_(self.bucket).remove([object_name])
                logger.info("Deleted %s from Supabase Storage", object_name)
                return
            except Exception as e:
                logger.error("Failed to delete %s from Supabase: %s", object_name, e)

        # Local fallback
        local_path = object_name
        if not os.path.exists(local_path):
            local_path = os.path.join("uploads", "resumes", object_name)
        if os.path.exists(local_path):
            os.remove(local_path)
            logger.info("Deleted local file %s", local_path)

    def generate_signed_url(self, object_name: str, expires_in: int = 900) -> str:
        """
        Generates a temporary public URL to download the file.
        """
        if self.enabled:
            try:
                res = self.client.storage.from_(self.bucket).create_signed_url(object_name, expires_in=expires_in)
                signed_url = None
                if isinstance(res, dict):
                    signed_url = res.get("signedURL")
                elif hasattr(res, "get"):
                    signed_url = res.get("signedURL")
                
                if signed_url:
                    logger.info("Generated signed URL for %s", object_name)
                    return signed_url
            except Exception as e:
                logger.error("Failed to generate signed URL for %s from Supabase: %s", object_name, e)

        # Local fallback or return local path
        return f"/uploads/resumes/{object_name}"

    def file_exists(self, object_name: str) -> bool:
        """
        Checks if a file exists in Supabase storage or local disk.
        """
        if self.enabled:
            try:
                parts = object_name.rsplit("/", 1)
                prefix = parts[0] if len(parts) == 2 else ""
                filename = parts[1] if len(parts) == 2 else object_name
                
                res = self.client.storage.from_(self.bucket).list(prefix or None)
                for item in res:
                    if item.get("name") == filename:
                        return True
                return False
            except Exception as e:
                logger.error("Failed to check if %s exists in Supabase: %s", object_name, e)
                return False

        # Local fallback
        local_path = object_name
        if not os.path.exists(local_path):
            local_path = os.path.join("uploads", "resumes", object_name)
        return os.path.exists(local_path)
