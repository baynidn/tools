import { Button, Divider, HStack, Image, LazyVStack, Navigation, Rectangle, ScrollView, Spacer, Text, TextField, VStack, ZStack, useEffect, useMemo, useState } from "scripting"
import { GlassCard } from "../components/GlassCard"
import { GlassText } from "../components/GlassText"
import { ModuleRow } from "../components/ModuleRow"
import { SectionTitle } from "../components/SectionTitle"
import { StatTile } from "../components/StatTile"
import { rootToolbar } from "../components/TopToolbar"
import { TOOL_VERSION } from "../constants"
import { useLibrary } from "../contexts/LibraryContext"
import { actionButtonFrame, cardShape, centerFillFrame, fullFillFrame, leadingFillFrame, motion, pageGradient, palette, spacing } from "../design/AllPatternDesign"
import type { ModuleEntry } from "../types"
import { formatBytes } from "../utils/moduleContent"

/** 首页（唯一页面） */
export function SurgeHomePage({
  initialUrl,
  initialName,
}: {
  initialUrl?: string
  initialName?: string
}) {
  const { modules, loading, busy, settings, refresh, updateAll, updateOne, addFromURL, chooseFolder, reload, showNotice } = useLibrary()
  const dismiss = Navigation.useDismiss()

  const [showInstall, setShowInstall] = useState<boolean>(false)
  const [url, setUrl] = useState<string>(initialUrl ?? "")
  const [name, setName] = useState<string>(initialName ?? "")
  const [installing, setInstalling] = useState<boolean>(false)
  const [installError, setInstallError] = useState<string | null>(null)
  const [installResult, setInstallResult] = useState<ModuleEntry | null>(null)

  const visibleModules = useMemo(
    () => (settings.showModulesWithoutUrl ? modules : modules.filter(item => item.hasSubscription)),
    [modules, settings.showModulesWithoutUrl]
  )
  const stats = useMemo(() => ({
    total: modules.length,
    withUrl: modules.filter(item => item.hasSubscription).length,
    failed: modules.filter(item => item.status === "failed").length,
  }), [modules])

  async function submitInstall() {
    if (!url.trim()) {
      setInstallError("请填写模块链接")
      return
    }
    setInstalling(true)
    setInstallError(null)
    setInstallResult(null)
    try {
      const entry = await addFromURL(url, name)
      setInstallResult(entry)
    } catch (err) {
      setInstallError(err instanceof Error ? err.message : String(err))
    } finally {
      setInstalling(false)
    }
  }

  // 从 URL Scheme 带链接进来时，自动展开安装表单并下载
  useEffect(() => {
    if (initialUrl) {
      setShowInstall(true)
      void submitInstall()
    }
    // 仅在首次挂载时执行
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <ZStack>
      <Rectangle fill={pageGradient} ignoresSafeArea />
      <ScrollView
        navigationTitle="SurgeMod"
        navigationBarTitleDisplayMode="inline"
        toolbarBackgroundVisibility="hidden"
        toolbar={rootToolbar(dismiss, () => void refresh(), busy)}
        frame={fullFillFrame}
      >
        <VStack alignment="leading" spacing={spacing.lg} padding={spacing.lg} frame={leadingFillFrame}>
          <GlassCard>
            <HStack alignment="center" spacing={spacing.sm} frame={leadingFillFrame}>
              <StatTile label="模块" value={stats.total} tint={palette.secondaryLabel} />
              <Divider frame={{ height: 44 }} />
              <StatTile label="可更新" value={stats.withUrl} tint={palette.accent} />
              <Divider frame={{ height: 44 }} />
              <StatTile label="失败" value={stats.failed} tint={stats.failed > 0 ? palette.danger : palette.secondaryLabel} />
            </HStack>

            <Rectangle fill={palette.hairline} frame={{ height: 0.5, maxWidth: "infinity" }} />

            <HStack spacing={spacing.sm} frame={leadingFillFrame}>
              <Button
                buttonStyle="glassProminent"
                frame={actionButtonFrame}
                disabled={busy || loading}
                action={() => {
                  if (stats.withUrl === 0) {
                    showNotice("当前目录没有带 #SUBSCRIBED 的模块")
                    return
                  }
                  void updateAll()
                }}
              >
                <HStack spacing={6} frame={centerFillFrame} animation={{ animation: motion.quick, value: busy }}>
                  <Image systemName="arrow.triangle.2.circlepath" font="subheadline" symbolEffect={{ effect: "rotate", value: busy }} />
                  <Text font="subheadline" fontWeight="semibold" contentTransition="opacity">{busy ? "更新中…" : "更新全部"}</Text>
                </HStack>
              </Button>
              <Button
                buttonStyle="glassProminent"
                frame={actionButtonFrame}
                disabled={busy || loading}
                action={() => void reload()}
              >
                <HStack spacing={6} frame={centerFillFrame}>
                  <Image systemName="bolt.fill" font="subheadline" />
                  <Text font="subheadline" fontWeight="semibold">重载 Surge</Text>
                </HStack>
              </Button>
            </HStack>

            <HStack spacing={spacing.sm} frame={leadingFillFrame}>
              <Button
                buttonStyle="glassProminent"
                frame={actionButtonFrame}
                disabled={busy || loading}
                action={() => setShowInstall(value => !value)}
              >
                <HStack spacing={6} frame={centerFillFrame}>
                  <Image systemName="link.badge.plus" font="subheadline" />
                  <Text font="subheadline" fontWeight="semibold">从链接安装</Text>
                </HStack>
              </Button>
              <Button
                buttonStyle="glassProminent"
                frame={actionButtonFrame}
                disabled={busy || loading}
                action={() => void chooseFolder()}
              >
                <HStack spacing={6} frame={centerFillFrame}>
                  <Image systemName="folder.badge.plus" font="subheadline" />
                  <Text font="subheadline" fontWeight="semibold">选择文件夹</Text>
                </HStack>
              </Button>
            </HStack>
          </GlassCard>

          {showInstall ? (
            <GlassCard>
              <HStack spacing={spacing.sm} frame={leadingFillFrame}>
                <Image systemName="link.badge.plus" font="title2" foregroundStyle={palette.accent} />
                <Text font="title3" fontWeight="semibold">从链接安装</Text>
              </HStack>
              <Text font="caption" foregroundStyle={palette.secondaryLabel}>
                会下载远端内容并保存为 Surge 模块，同时记录 #SUBSCRIBED，之后可一键更新。
              </Text>

              <Text font="caption" foregroundStyle={palette.secondaryLabel}>模块链接</Text>
              <TextField
                title="模块链接"
                prompt="https://example.com/foo.sgmodule"
                value={url}
                onChanged={setUrl}
                disabled={installing}
              />
              <Text font="caption2" foregroundStyle={palette.tertiaryLabel}>
                也可直接粘贴 Surge 的导入链接，会自动取出真正的资源地址。
              </Text>

              <Text font="caption" foregroundStyle={palette.secondaryLabel}>文件名称（选填，默认取模块名）</Text>
              <TextField
                title="名称"
                prompt="MyModule"
                value={name}
                onChanged={setName}
                disabled={installing}
              />

              <Button
                buttonStyle="glassProminent"
                frame={leadingFillFrame}
                disabled={installing || busy}
                action={() => void submitInstall()}
              >
                <HStack spacing={6} animation={{ animation: motion.quick, value: installing }}>
                  <Image systemName="arrow.down.circle" symbolEffect={{ effect: "bounce", value: installing }} />
                  <Text contentTransition="opacity">{installing ? "下载中…" : "下载并保存"}</Text>
                </HStack>
              </Button>

              {installError ? (
                <GlassText>
                  <Text font="caption" foregroundStyle={palette.danger} contentTransition="opacity">{installError}</Text>
                </GlassText>
              ) : null}

              {installResult ? (
                <GlassText>
                  <HStack spacing={spacing.sm} frame={leadingFillFrame}>
                    <Image systemName="checkmark.circle.fill" font="title2" foregroundStyle={palette.success} />
                    <VStack alignment="leading" spacing={2}>
                      <Text font="headline" contentTransition="opacity">{installResult.name}</Text>
                      <Text font="caption" foregroundStyle={palette.secondaryLabel} contentTransition="opacity">
                        {installResult.fileName} · {formatBytes(installResult.size)}
                      </Text>
                    </VStack>
                  </HStack>
                  <Button
                    title="再装一个"
                    buttonStyle="glass"
                    action={() => {
                      setInstallResult(null)
                      setUrl("")
                      setName("")
                    }}
                  />
                </GlassText>
              ) : null}
            </GlassCard>
          ) : null}

          <SectionTitle title="模块" caption={`${stats.total} 个文件`} />

          {loading ? (
            <GlassCard>
              <HStack alignment="top" spacing={spacing.sm} frame={leadingFillFrame}>
                <Image systemName="hourglass" foregroundStyle={palette.secondaryLabel} symbolEffect="scale" />
                <Text font="subheadline" foregroundStyle={palette.secondaryLabel} contentTransition="opacity">正在扫描模块目录…</Text>
              </HStack>
            </GlassCard>
          ) : visibleModules.length === 0 ? (
            <GlassCard>
              <VStack alignment="leading" spacing={spacing.sm} frame={leadingFillFrame}>
                <Image systemName="tray" font="title" foregroundStyle={palette.tertiaryLabel} />
                <Text font="headline">目录里还没有模块</Text>
                <Text font="caption" foregroundStyle={palette.secondaryLabel} multilineTextAlignment="leading">
                  把 .sgmodule 文件放进模块目录，或从链接安装一个本地模块。
                </Text>
                <Button title="从链接安装" systemImage="link.badge.plus" buttonStyle="glassProminent" action={() => setShowInstall(true)} />
              </VStack>
            </GlassCard>
          ) : (
            <VStack
              spacing={0}
              frame={leadingFillFrame}
              background="rgba(120,120,128,0.10)"
              clipShape={cardShape}
            >
              <LazyVStack spacing={0}>
                {visibleModules.map((entry, index) => (
                  <VStack key={entry.path} alignment="leading" spacing={0} frame={leadingFillFrame}>
                    <Button buttonStyle="plain" disabled={busy} action={() => void updateOne(entry)}>
                      <VStack
                        alignment="leading"
                        padding={{ horizontal: spacing.lg, vertical: spacing.md }}
                        frame={leadingFillFrame}
                      >
                        <ModuleRow entry={entry} />
                      </VStack>
                    </Button>
                    {index < visibleModules.length - 1 ? (
                      <Rectangle fill={palette.hairline} frame={{ height: 0.5, maxWidth: "infinity" }} />
                    ) : null}
                  </VStack>
                ))}
              </LazyVStack>
            </VStack>
          )}

          <Text font="caption2" foregroundStyle={palette.tertiaryLabel} multilineTextAlignment="leading">
            SurgeMod v{TOOL_VERSION} · Surge 本地模块管理
          </Text>
        </VStack>
      </ScrollView>
    </ZStack>
  )
}
