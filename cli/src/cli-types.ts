import { Type } from 'cmd-ts'
import { existsSync } from 'node:fs'
import { CliError, CliErrorCode } from './errors'
import { isValidUrl, loadFile, loadJsonFromUrl } from './utils'

// ReadFile function is to load json file from
// url-link, or from local file directory
export const ReadFile: Type<string, string> = {
  async from(source) {
    if (await isValidUrl(source)) {
      return await loadJsonFromUrl(source)
    } else {
      if (!existsSync(source)) {
        throw new CliError(CliErrorCode.FileNotFound)
      }
      return JSON.parse((await loadFile(source)).toString())
    }
  }
}

interface IHeader {
  'Content-Type': string
}

interface IReducer {
  function: string
  args: string[]
}

interface IFeed {
  url: string
  headers?: IHeader[]
  method: string
  reducers?: IReducer[]
}

export interface IAdapter {
  adapterHash?: string
  name: string
  decimals: number
  feeds: IFeed[]
}

export interface IAggregator {
  aggregatorHash?: string
  active: boolean
  name: string
  address: string
  heartbeat: number
  threshold: number
  absoluteThreshold: number
  adapterHash: string
}
