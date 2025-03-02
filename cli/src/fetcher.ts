import axios from 'axios'
import { command, subcommands, option, string as cmdstring } from 'cmd-ts'
import { buildUrl, isOraklFetcherHealthy } from './utils'
import { ORAKL_NETWORK_FETCHER_URL } from './settings'

export function fetcherSub() {
  // fetcher start --id ${aggregatorHash} --chain ${chain}
  // fetcher stop --id ${aggregatorHash} --chain ${chain}

  const start = command({
    name: 'start',
    args: {
      id: option({
        type: cmdstring,
        long: 'id'
      }),
      chain: option({
        type: cmdstring,
        long: 'chain'
      })
    },
    handler: startHandler()
  })

  const stop = command({
    name: 'stop',
    args: {
      id: option({
        type: cmdstring,
        long: 'id'
      }),
      chain: option({
        type: cmdstring,
        long: 'chain'
      })
    },
    handler: stopHandler()
  })

  return subcommands({
    name: 'fetcher',
    cmds: { start, stop }
  })
}

export function startHandler() {
  async function wrapper({ id, chain }: { id: string; chain: string }) {
    if (!(await isOraklFetcherHealthy())) return

    try {
      const endpoint = buildUrl(ORAKL_NETWORK_FETCHER_URL, `start/${id}`)
      const response = await axios.get(endpoint, { data: { chain } })
      console.log(response?.data)
    } catch (e) {
      console.dir(e?.response?.data, { depth: null })
    }
  }
  return wrapper
}

export function stopHandler() {
  async function wrapper({ id, chain }: { id: string; chain: string }) {
    if (!(await isOraklFetcherHealthy())) return

    try {
      const endpoint = buildUrl(ORAKL_NETWORK_FETCHER_URL, `stop/${id}`)
      const response = await axios.get(endpoint, { data: { chain } })
      console.log(response?.data)
    } catch (e) {
      console.dir(e?.response?.data, { depth: null })
    }
  }
  return wrapper
}
