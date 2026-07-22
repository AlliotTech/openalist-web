declare module "libass-wasm" {
  interface OptionsBase {
    video?: HTMLVideoElement
    canvas?: HTMLCanvasElement
    workerUrl?: string
    legacyWorkerUrl?: string
    fonts?: string[]
    availableFonts?: Record<string, string>
    fallbackFont?: string
    timeOffset?: number
    debug?: boolean
    onReady?: () => void
    onError?: (event: ErrorEvent) => void
    renderMode?: "js-blend" | "wasm-blend" | "lossy"
    targetFps?: number
    libassMemoryLimit?: number
    libassGlyphLimit?: number
    prescaleFactor?: number
    prescaleHeightLimit?: number
    maxRenderHeight?: number
    dropAllAnimations?: boolean
    lossyRender?: boolean
  }

  interface OptionsWithSubUrl extends OptionsBase {
    subUrl: string
  }

  interface OptionsWithSubContent extends OptionsBase {
    subContent: string
  }

  export type Options = OptionsWithSubUrl | OptionsWithSubContent

  export default class SubtitlesOctopus {
    constructor(options: Options)

    setIsPaused(isPaused: boolean, currentTime: number): void
    setCurrentTime(time: number): void
    setTrackByUrl(url: string): void
    setTrack(content: string): void
    freeTrack(): void
    dispose(): void
  }
}
