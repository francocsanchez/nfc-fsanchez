import "server-only";

const IMAGEKIT_UPLOAD_URL = "https://upload.imagekit.io/api/v1/files/upload";
const IMAGEKIT_DELETE_URL = "https://api.imagekit.io/v1/files";

export const PROFILE_PHOTO_MAX_BYTES = 1024 * 1024;
export const PROFILE_PHOTO_ALLOWED_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
] as const;

type ImageKitUploadResponse = {
  fileId?: string;
  url?: string;
  message?: string;
};

type ImageKitDeleteResponse = {
  message?: string;
  help?: string;
};

function getImageKitConfig() {
  const publicKey = process.env.IMAGEKIT_PUBLIC_KEY?.trim();
  const privateKey = process.env.IMAGEKIT_PRIVATE_KEY?.trim();
  const urlEndpoint = process.env.IMAGEKIT_URL_ENDPOINT?.trim();
  const profilePhotosFolder =
    process.env.IMAGEKIT_PROFILE_PHOTOS_FOLDER?.trim() || "/credenciales";

  if (!publicKey || !privateKey || !urlEndpoint) {
    throw new Error(
      "ImageKit no esta configurado. Completa IMAGEKIT_PUBLIC_KEY, IMAGEKIT_PRIVATE_KEY e IMAGEKIT_URL_ENDPOINT.",
    );
  }

  return {
    publicKey,
    privateKey,
    urlEndpoint,
    profilePhotosFolder,
  };
}

function getBasicAuthHeader(privateKey: string) {
  return `Basic ${Buffer.from(`${privateKey}:`).toString("base64")}`;
}

function getFileExtension(file: File) {
  const fromName = file.name.trim().match(/(\.[a-z0-9]+)$/i)?.[1];

  if (fromName) {
    return fromName.toLowerCase();
  }

  switch (file.type) {
    case "image/jpeg":
      return ".jpg";
    case "image/png":
      return ".png";
    case "image/webp":
      return ".webp";
    default:
      return "";
  }
}

export function validateProfilePhotoFile(file: File) {
  if (!PROFILE_PHOTO_ALLOWED_TYPES.includes(file.type as (typeof PROFILE_PHOTO_ALLOWED_TYPES)[number])) {
    throw new Error("Sube una imagen JPG, PNG o WebP.");
  }

  if (file.size > PROFILE_PHOTO_MAX_BYTES) {
    throw new Error("La imagen no puede superar 1 MB.");
  }

  if (file.size === 0) {
    throw new Error("La imagen seleccionada esta vacia.");
  }
}

export async function uploadProfilePhotoToImageKit(slug: string, file: File) {
  const { privateKey, profilePhotosFolder } = getImageKitConfig();
  const fileExtension = getFileExtension(file);
  const fileName = `${slug}${fileExtension}`;
  const body = new FormData();

  body.append(
    "file",
    new Blob([await file.arrayBuffer()], { type: file.type }),
    file.name,
  );
  body.append("fileName", fileName);
  body.append("folder", profilePhotosFolder);
  body.append("useUniqueFileName", "false");
  body.append("overwriteFile", "true");

  const response = await fetch(IMAGEKIT_UPLOAD_URL, {
    method: "POST",
    headers: {
      Authorization: getBasicAuthHeader(privateKey),
    },
    body,
  });

  const data = (await response.json().catch(() => null)) as ImageKitUploadResponse | null;

  if (!response.ok || !data?.fileId || !data.url) {
    throw new Error(data?.message ?? "No se pudo subir la foto a ImageKit.");
  }

  return {
    fileId: data.fileId,
    url: data.url,
  };
}

export async function deleteImageKitFile(
  fileId: string,
  options?: { ignoreNotFound?: boolean },
) {
  const { privateKey } = getImageKitConfig();
  const response = await fetch(`${IMAGEKIT_DELETE_URL}/${fileId}`, {
    method: "DELETE",
    headers: {
      Authorization: getBasicAuthHeader(privateKey),
    },
  });

  if (response.ok) {
    return;
  }

  if (options?.ignoreNotFound && response.status === 404) {
    return;
  }

  const data = (await response.json().catch(() => null)) as ImageKitDeleteResponse | null;

  throw new Error(data?.message ?? "No se pudo eliminar la foto en ImageKit.");
}
