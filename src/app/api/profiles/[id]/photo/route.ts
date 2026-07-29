import { getSessionFromHeaders } from "@/lib/auth-session";
import {
  clearProfilePhoto,
  getProfilePhotoAssetById,
  updateProfilePhoto,
} from "@/lib/profiles";
import {
  deleteImageKitFile,
  uploadProfilePhotoToImageKit,
  validateProfilePhotoFile,
} from "@/lib/imagekit";

function createUnauthorizedResponse() {
  return Response.json({ error: "No autorizado." }, { status: 401 });
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!(await getSessionFromHeaders(request.headers))) {
    return createUnauthorizedResponse();
  }

  try {
    const { id } = await params;
    const profile = await getProfilePhotoAssetById(id);

    if (!profile) {
      return Response.json({ error: "Perfil no encontrado." }, { status: 404 });
    }

    const formData = await request.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      return Response.json(
        { error: "Selecciona una imagen valida." },
        { status: 400 },
      );
    }

    validateProfilePhotoFile(file);

    const uploadedPhoto = await uploadProfilePhotoToImageKit(profile.slug, file);

    if (
      profile.profilePhotoFileId &&
      profile.profilePhotoFileId !== uploadedPhoto.fileId
    ) {
      await deleteImageKitFile(profile.profilePhotoFileId, {
        ignoreNotFound: true,
      });
    }

    const updatedProfile = await updateProfilePhoto(id, {
      profilePhotoUrl: uploadedPhoto.url,
      profilePhotoFileId: uploadedPhoto.fileId,
    });

    if (!updatedProfile) {
      await deleteImageKitFile(uploadedPhoto.fileId, { ignoreNotFound: true });

      return Response.json({ error: "Perfil no encontrado." }, { status: 404 });
    }

    return Response.json({ profile: updatedProfile });
  } catch (error) {
    if (error instanceof Error) {
      return Response.json({ error: error.message }, { status: 400 });
    }

    console.error("Failed to upload profile photo", error);

    return Response.json(
      { error: "No se pudo subir la foto del perfil." },
      { status: 500 },
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!(await getSessionFromHeaders(request.headers))) {
    return createUnauthorizedResponse();
  }

  try {
    const { id } = await params;
    const profile = await getProfilePhotoAssetById(id);

    if (!profile) {
      return Response.json({ error: "Perfil no encontrado." }, { status: 404 });
    }

    if (profile.profilePhotoFileId) {
      await deleteImageKitFile(profile.profilePhotoFileId, {
        ignoreNotFound: true,
      });
    }

    const updatedProfile = await clearProfilePhoto(id);

    if (!updatedProfile) {
      return Response.json({ error: "Perfil no encontrado." }, { status: 404 });
    }

    return Response.json({ profile: updatedProfile });
  } catch (error) {
    console.error("Failed to delete profile photo", error);

    return Response.json(
      { error: "No se pudo eliminar la foto del perfil." },
      { status: 500 },
    );
  }
}
