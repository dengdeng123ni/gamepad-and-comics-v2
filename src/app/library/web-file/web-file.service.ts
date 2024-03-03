import { Injectable } from '@angular/core';
import { DbControllerService, DownloadService } from '../public-api';

@Injectable({
  providedIn: 'root'
})
export class WebFileService {

  dirHandle = null;
  paths = [];
  constructor(public DbController: DbControllerService, public download: DownloadService,) {
  }


  async open() {
    this.dirHandle = await (window as any).showDirectoryPicker({ mode: "readwrite" });
    // await this.getPaths();
  }
  async getPaths() {
    let files_arr = [];
    const handleDirectoryEntry = async (dirHandle: any, out: { [x: string]: {}; }, path: any) => {
      if (dirHandle.kind === "directory") {
        for await (const entry of dirHandle.values()) {
          if (entry.kind === "file") {
            const arr = entry.name.split(".");
            if (arr.length == 2 && ["jpg", "png", "bmp", "jpeg", "psd", "webp"].includes(arr[1])) {
              out[entry.name] = { dirHandle: entry, path: `${path}/${entry.name}`.substring(1), name: entry.name };
              this.paths.push({ dirHandle: entry, path: `${path}/${entry.name}`.substring(1), name: entry.name })
            }
          }
          if (entry.kind === "directory") {
            const newOut = out[entry.name] = {};
            await handleDirectoryEntry(entry, newOut, `${path}/${entry.name}`);
          }
        }
      }
      if (dirHandle.kind === "file") {
        const entry = dirHandle;
        const arr = entry.name.split(".");
        if (arr.length == 2 && ["jpg", "png", "bmp", "jpeg", "psd", "webp"].includes(arr[1])) return
        out[entry.name] = { dirHandle: entry, path: `${path}/${entry.name}`.substring(1), name: entry.name };
        this.paths.push({ dirHandle: entry, path: `${path}/${entry.name}`.substring(1), name: entry.name })
      }
    }
    await handleDirectoryEntry(this.dirHandle, {}, '')

  }
  async post(path, blob): Promise<boolean> {
    const obj = this.paths.find(x => x.path == path)
    if (!obj) {
      const arr = path.split("/")
      const createDirHandle = async (dirHandle, path_arr, index) => {
        if ((path_arr.length - 1) == index) {
          for await (const it of dirHandle.values()) {
            if (it.name == path_arr[index]) {
              return null;
            }
          }
          const res = await dirHandle.getFileHandle(path_arr[index], {
            create: true,
          });
          return res
        } else {

          const res = await dirHandle.getDirectoryHandle(path_arr[index], {
            create: true,
          });
          index++;
          return await createDirHandle(res, path_arr, index)
        }
      }
      const dir = await createDirHandle(this.dirHandle, arr, 0)
      if (dir) {
        const writable = await dir.createWritable();
        await writable.write(blob);
        await writable.close();
        this.paths.push({ dirHandle: dir, path: path.substring(1), name: dir.name })
      }
    }
    return true
  }

  async get(path): Promise<Blob> {

    return new Blob([])
  }

  async del(path): Promise<boolean> {
    return true
  }

  async downloadComics(comics_id, option?: {
    chapters_ids?: Array<any>,
    type?: string
  }) {
    await this.open();
    const toTitle = (title) => {
      return title.replace(/[\r\n]/g, "").replace(/  +/g, ' ').trim()
    }
    let { chapters, title, option: config } = await this.DbController.getDetail(comics_id)
    if (option?.chapters_ids?.length) chapters = chapters.filetr(x => option.chapters_ids.includes(x.id))
    for (let index = 0; index < chapters.length; index++) {
      const x = chapters[index];
      const pages = await this.DbController.getPages(x.id);
      if (option?.type) {
        const pageOrder = false;
        const x = chapters[index]
        const pages = await this.DbController.getPages(x.id);
        const isFirstPageCover = true;
        const page = "double";
        const blob = await this.download.ImageToTypeBlob({ type: option.type, name: toTitle(x.title), images: pages.map((x: { src: any; }) => x.src), pageOrder: pageOrder, isFirstPageCover: isFirstPageCover, page: page }) as any
        let suffix_name=blob.type.split("/").at(-1);
        if (option.type == "PDF") {

        }
        if (option.type == "PPT") {
          suffix_name = `pptx`;
        }
        if (option.type == "ZIP") {
        }
        if (option.type == "EPUB") {
          suffix_name = `epub`;
        }
        if (config.is_offprint) {
          await this.post(`${config.origin}_${suffix_name}/${toTitle(title)}.${suffix_name}`, blob)
        } else {
          await this.post(`${config.origin}_${suffix_name}/${toTitle(title)}/${toTitle(x.title)}.${suffix_name}`, blob)
        }
      } else {
        const downloadImage = async (x2, index) => {
          const blob = await this.DbController.getImage(x2.src)

          if (blob.size > 500) {
            if (config.is_offprint) {
              await this.post(`${config.origin}/${toTitle(title)}/${index + 1}.${blob.type.split("/").at(-1)}`, blob)
            } else {
              await this.post(`${config.origin}/${toTitle(title)}/${toTitle(x.title)}/${index + 1}.${blob.type.split("/").at(-1)}`, blob)
            }
          } else {
            const blob = await this.DbController.getImage(x2.src)
            if (blob.size > 500) {
              if (config.is_offprint) {
                await this.post(`${config.origin}/${toTitle(title)}/${index + 1}.${blob.type.split("/").at(-1)}`, blob)
              } else {
                await this.post(`${config.origin}/${toTitle(title)}/${toTitle(x.title)}/${index + 1}.${blob.type.split("/").at(-1)}`, blob)
              }
            }
          }
        }
        await Promise.all(pages.map((x2, index) => downloadImage(x2, index)))
      }
    }
  }



}
