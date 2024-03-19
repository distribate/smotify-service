"use client"

import { UserTips } from "@/components/tooltip/action";
import { usePlayer } from "@/lib/hooks/player/use-player";
import { SongEntity } from "@/types/entities/song";
import { IoMdPlay } from "react-icons/io";
import { MdPause } from "react-icons/md";

type SongPlayingAttributeGeneric = {
  list_id: string,
  song: SongEntity,
}

export const SongPlayingAttribute = ({
  list_id,
  song
}: SongPlayingAttributeGeneric) => {
  const { playerState } = usePlayer();

  return (
    <div className="px-4 relative overflow-hidden w-[46px]">
      {playerState.active?.id === song.id ? (
        <div className="group-hover:block hidden text-3xl">
          <MdPause size={20} />
        </div>
      ) : (
        <div className="group-hover:block hidden text-3xl">
          <UserTips action={`Play ${song.title} by ${song.author}`}>
            <IoMdPlay size={20} />
          </UserTips>
        </div>
      )}
      {playerState.active?.id === song.id ? (
        <div className="loading-wave group-hover:hidden visible">
          <div className="loading-bar"></div>
          <div className="loading-bar"></div>
          <div className="loading-bar"></div>
          <div className="loading-bar"></div>
        </div>
      ) : (
        <p className="group-hover:hidden block">
          {list_id}
        </p>
      )}
    </div>
  )
}