export interface ExternalPlayer {
  icon: string
  name: string
  scheme: string
}

export const players: ExternalPlayer[] = [
  { icon: "iina", name: "IINA", scheme: "iina://weblink?url=$edurl" },
  { icon: "potplayer", name: "PotPlayer", scheme: "potplayer://$durl" },
  { icon: "vlc", name: "VLC", scheme: "vlc://$durl" },
  { icon: "nplayer", name: "nPlayer", scheme: "nplayer-$durl" },
  {
    icon: "omniplayer",
    name: "OmniPlayer",
    scheme: "omniplayer://weblink?url=$durl",
  },
  {
    icon: "figplayer",
    name: "Fig Player",
    scheme: "figplayer://weblink?url=$durl",
  },
  {
    icon: "infuse",
    name: "Infuse",
    scheme: "infuse://x-callback-url/play?url=$durl",
  },
  {
    icon: "fileball",
    name: "Fileball",
    scheme: "filebox://play?url=$durl",
  },
  {
    icon: "mxplayer",
    name: "MX Player",
    scheme:
      "intent:$durl#Intent;package=com.mxtech.videoplayer.ad;S.title=$name;end",
  },
  {
    icon: "mxplayer-pro",
    name: "MX Player Pro",
    scheme:
      "intent:$durl#Intent;package=com.mxtech.videoplayer.pro;S.title=$name;end",
  },
  {
    icon: "iPlay",
    name: "iPlay",
    scheme: "iplay://play/any?type=url&url=$bdurl",
  },
  { icon: "mpv", name: "mpv", scheme: "mpv://$edurl" },
]
