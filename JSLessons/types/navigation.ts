/** 路由：首页 + 章节页。写法照 ModuleDock 的 Route / Navigate。 */

export type Route = { name: "home" } | { name: "lesson"; id: number }

export type Navigate = (next: Route) => void
