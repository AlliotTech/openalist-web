import { Dynamic, Portal } from "solid-js/web"
import { Center } from "./Center"
import { Right } from "./Right"
import { Component, createSignal, For, onCleanup } from "solid-js"
import { BackTop } from "./BackTop"
import { bus } from "~/utils/bus"

interface ToolEntry {
  key: string
  load: () => Promise<Component>
}

const copyMoveEntry: ToolEntry = {
  key: "copy-move",
  load: async () => {
    const { Copy, Move } = await import("./CopyMove")
    return () => (
      <>
        <Copy />
        <Move />
      </>
    )
  },
}

const toolEntries: Record<string, ToolEntry> = {
  copy: copyMoveEntry,
  move: copyMoveEntry,
  rename: {
    key: "rename",
    load: async () => (await import("./Rename")).Rename,
  },
  delete: {
    key: "delete",
    load: async () => (await import("./Delete")).Delete,
  },
  decompress: {
    key: "decompress",
    load: async () => (await import("./Decompress")).Decompress,
  },
  new_file: {
    key: "new-file",
    load: async () => (await import("./NewFile")).NewFile,
  },
  mkdir: {
    key: "mkdir",
    load: async () => (await import("./Mkdir")).Mkdir,
  },
  recursiveMove: {
    key: "recursive-move",
    load: async () => (await import("./RecursiveMove")).RecursiveMove,
  },
  removeEmptyDirectory: {
    key: "remove-empty-directory",
    load: async () =>
      (await import("./RemoveEmptyDirectory")).RemoveEmptyDirectory,
  },
  batchRename: {
    key: "batch-rename",
    load: async () => (await import("./BatchRename")).BatchRename,
  },
  offline_download: {
    key: "offline-download",
    load: async () => (await import("./OfflineDownload")).OfflineDownload,
  },
  package_download: {
    key: "package-download",
    load: async () => (await import("./Download")).PackageDownloadModal,
  },
  local_settings: {
    key: "local-settings",
    load: async () => (await import("./LocalSettings")).LocalSettings,
  },
  upload: {
    key: "upload",
    load: async () => {
      const [{ default: Upload }, { ModalWrapper }] = await Promise.all([
        import("../uploads/Upload"),
        import("./ModalWrapper"),
      ])
      return () => (
        <ModalWrapper name="upload" title="home.toolbar.upload">
          <Upload />
        </ModalWrapper>
      )
    },
  },
}

export const Modal = () => {
  const [components, setComponents] = createSignal<Component[]>([])
  const loaded = new Set<string>()
  const pending = new Map<string, Promise<void>>()
  let disposed = false

  const loadEntry = (entry: ToolEntry, label: string, replay: () => void) => {
    if (loaded.has(entry.key)) return
    let task = pending.get(entry.key)
    if (!task) {
      task = entry
        .load()
        .then((component) => {
          if (disposed) return
          loaded.add(entry.key)
          setComponents((current) => [...current, component])
        })
        .catch((error) => {
          console.error(`failed to load toolbar action: ${label}`, error)
        })
        .finally(() => {
          pending.delete(entry.key)
        })
      pending.set(entry.key, task)
    }

    void task.then(() => {
      if (!disposed && loaded.has(entry.key)) {
        setTimeout(replay)
      }
    })
  }
  const loadTool = (name: string) => {
    const entry = toolEntries[name]
    if (entry) loadEntry(entry, name, () => bus.emit("tool", name))
  }
  const loadExtract = (args: string) => {
    loadEntry(toolEntries.decompress, "extract", () =>
      bus.emit("extract", args),
    )
  }

  bus.on("tool", loadTool)
  bus.on("extract", loadExtract)
  onCleanup(() => {
    disposed = true
    bus.off("tool", loadTool)
    bus.off("extract", loadExtract)
  })

  return (
    <For each={components()}>
      {(component) => <Dynamic component={component} />}
    </For>
  )
}

export const Toolbar = () => {
  return (
    <Portal>
      <Right />
      <Center />
      <Modal />
      <BackTop />
    </Portal>
  )
}
