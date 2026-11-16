/** 读取 URL 查询串里的某个参数，失败时返回原值 */
export function readQueryValue(url: string, key: string): string | null {
  const index = url.indexOf("?")
  if (index < 0) {
    return null
  }
  const query = url.slice(index + 1).split("#")[0]
  for (const part of query.split("&")) {
    const eq = part.indexOf("=")
    if (eq <= 0) {
      continue
    }
    if (part.slice(0, eq) !== key) {
      continue
    }
    const raw = part.slice(eq + 1)
    try {
      return decodeURIComponent(raw)
    } catch {
      return raw
    }
  }
  return null
}

/** 解析后的用户输入 */
export type ParsedModuleInput = {
  /** 真正要下载的链接 */
  url: string
  /** 链接中携带的文件名 */
  name: string | null
}

/** 去掉前缀后取值，前缀不匹配时返回 null */
function afterPrefix(input: string, prefix: string): string | null {
  if (!input.toLowerCase().startsWith(prefix.toLowerCase())) {
    return null
  }
  return input.slice(prefix.length)
}

/** 还原成真正的资源链接（只处理 Surge 相关格式） */
export function parseModuleInput(raw: string): ParsedModuleInput {
  const input = (raw || "").trim()
  if (!input) {
    return { url: "", name: null }
  }

  // 本应用自己的调用链接（scripting:// / scriptable:// 都兼容）
  const lowerInput = input.toLowerCase()
  if (lowerInput.startsWith("scripting://run") || lowerInput.startsWith("scriptable://")) {
    const inner = readQueryValue(input, "url") ?? ""
    return {
      url: inner,
      name: readQueryValue(input, "name"),
    }
  }

  // Surge 远程模块
  if (afterPrefix(input, "surge:///install-module") !== null) {
    const inner = readQueryValue(input, "url") ?? ""
    return { url: inner, name: readQueryValue(input, "name") }
  }

  return {
    url: input,
    name: readQueryValue(input, "name"),
  }
}

/** 从 Script-Hub 的转换结果里取出文件名（/_end_/<name><suffix>?<params>） */
export function fileNameFromConvertedUrl(url: string): string | null {
  const marker = "/_end_/"
  const index = url.indexOf(marker)
  if (index < 0) {
    return null
  }
  const rest = url.slice(index + marker.length).split("?")[0]
  try {
    return decodeURIComponent(rest)
  } catch {
    return rest
  }
}

/** 去掉 .sgmodule 后缀，得到文件名主干 */
export function stripKnownExtension(name: string): string {
  const lower = name.toLowerCase()
  if (lower.endsWith(".sgmodule")) {
    return name.slice(0, name.length - ".sgmodule".length)
  }
  return name
}

/** 构造 Surge 的远程导入链接 */
export function buildRemoteImportUrl(moduleUrl: string, name?: string): string {
  const encoded = encodeURIComponent(moduleUrl)
  if (name) {
    return `surge:///install-module?url=${encoded}&name=${encodeURIComponent(name)}`
  }
  return `surge:///install-module?url=${encoded}`
}
