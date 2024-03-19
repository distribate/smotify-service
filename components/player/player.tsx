"use client"

import { useUser } from "@/lib/hooks/actions/user/auth/use-user";
import { PlayerVolumeControls } from "./controls/volume";
import { PlayerControls } from "./controls";
import { PlayerSongInfo } from "./info";
import { useVolume } from "@/lib/hooks/player/use-volume";
import { useAudio } from "../../lib/hooks/player/use-audio";
import { usePlayer } from "@/lib/hooks/player/use-player";

export const Player = () => {
  const { playerState } = usePlayer();
  const { data: user } = useUser();
  const {
    volume,
    handleVolumeChange,
    mute,
    unmute
  } = useVolume();
  const {
    howlInstance,
    onPlayNext,
    onPlayPrev,
    playing,
    song,
    position,
    duration,
    handleTogglePlay,
    handleSliderChange
  } = useAudio();

  if (!playerState.active || !user) return;

  return (
    (howlInstance && playerState.active && user) && (
      <div className="fixed bottom-0 bg-black w-full py-1 md:py-2 h-[88px] px-4">
        <div className="flex justify-between items-center h-full">
          <PlayerSongInfo
            song={song!}
            list={playerState.ids}
          />
          <PlayerControls
            playing={playing}
            onTogglePlay={handleTogglePlay}
            onPlayNext={onPlayNext}
            onPlayPrev={onPlayPrev}
            currentPosition={position}
            maxDuration={duration}
            duration={duration}
            onSliderChange={(value: number[]) => {
              handleSliderChange(value[0])
            }}
          />
          <PlayerVolumeControls
            onValueChange={(value: number[]) => {
              handleVolumeChange(value[0])
            }}
            mute={mute}
            unmute={unmute}
            volume={volume}
          />
        </div>
      </div>
    )
  )
}