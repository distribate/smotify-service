import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/lib/utils/supabase/client/supabase-client";
import { PlaylistEntity } from "@/types/playlist";
import { playlistByParamIdQueryKey } from "@/lib/querykeys/playlist";
import { uploadFileToBuckets } from "@/lib/utils/file/upload-file-to-buckets";
import { useToast } from "@/lib/hooks/ui/use-toast";
import uniqueId from "uniqid"
import { getArrayBuffer } from "@/components/forms/artist/hooks/use-create-artist-image";
import { encode } from "base64-arraybuffer"

const supabase = createClient();

type CreatePlaylistImageQueryType = {
	imagePath: string,
	playlistId: string
}

async function createPlaylistImageQuery({
	imagePath,
	playlistId
}: CreatePlaylistImageQueryType) {
	const { data: imageData, error: createdPlaylistImageErr } = await supabase
	.from("playlists")
	.update({
		image_path: imagePath
	})
	.eq("id", playlistId)
	.select()
	
	if (createdPlaylistImageErr) throw createdPlaylistImageErr;
	
	return { imageData }
}

export const useUploadPlaylistImage = () => {
	const qc = useQueryClient();
	
	const uploadPlaylistImageMutation = useMutation({
		mutationFn: async({
			playlist, image_file, image_path
		}: {
			playlist: PlaylistEntity, image_file?: File, image_path?: string
		}) => {
			if (!playlist) return;
			
			if (image_file) {
				const uniq = uniqueId()
				const fileName = `playlist-${playlist.title}-${uniq}`
				const base64File = await getArrayBuffer(image_file)
				const encodedFile = encode(base64File)
				
				return uploadFileToBuckets({
					fileName,
					bucket: "images",
					file: encodedFile,
					contentType: "image/png"
				})
			} else if (image_path) {
				return createPlaylistImageQuery({
					imagePath: image_path,
					playlistId: playlist.id
				})
			}
		},
		onSuccess: (data, variables, context) => qc.invalidateQueries({ queryKey: playlistByParamIdQueryKey(variables.playlist.id) }),
	  onError: e => {throw new Error(e.message)}
	})
	
	return { uploadPlaylistImageMutation }
}