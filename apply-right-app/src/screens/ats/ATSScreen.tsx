import { useMemo, useState } from 'react';
import { Alert, StatusBar, Text as RNText, useColorScheme } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Circle, G, Text as SvgText } from 'react-native-svg';
import { LinearGradient } from 'expo-linear-gradient';
import { useCVContext } from '../../context/CVContext';
import { useGeminiATSAnalysis } from '../../hooks/useGeminiATSAnalysis';
import { useGeminiCVOptimizer } from '../../hooks/useGeminiCVOptimizer';
import { useGeminiProfessionalBackground } from '../../hooks/useGeminiProfessionalBackground';
import { BarChart2, CheckCircle2, XCircle, Lightbulb, Wand2, AlertCircle, Sparkles } from 'lucide-react-native';
import type { CVData, OptimizationSuggestion } from '../../types/cv.types';
import {
  Box,
  Button,
  ButtonText,
  Card,
  Center,
  HStack,
  Heading,
  Input,
  InputField,
  Pressable,
  ScrollView,
  Spinner,
  Text,
  VStack,
} from '../../components/ui';
import { GradientHeader } from '../../components/ui/GradientHeader';

function DonutScore({ value, color, bgStroke }: { value: number; color: string; bgStroke: string }) {
  const size = 130;
  const stroke = 12;
  const radius = (size - stroke) / 2;
  const circ = 2 * Math.PI * radius;
  const offset = circ - (value / 100) * circ;
  return (
    <Svg width={size} height={size}>
      <G rotation="-90" originX={size / 2} originY={size / 2}>
        <Circle cx={size / 2} cy={size / 2} r={radius} stroke={bgStroke} strokeWidth={stroke} fill="transparent" />
        <Circle cx={size / 2} cy={size / 2} r={radius} stroke={color} strokeWidth={stroke} fill="transparent" strokeDasharray={`${circ} ${circ}`} strokeDashoffset={offset} strokeLinecap="round" />
      </G>
      <SvgText x={size / 2} y={size / 2 + 8} fontSize="26" fontFamily="Inter_700Bold" fill={color} textAnchor="middle">{value}%</SvgText>
    </Svg>
  );
}

function KeywordBar({ matched, missing }: { matched: number; missing: number }) {
  const total = Math.max(matched + missing, 1);
  const matchedW = (matched / total) * 100;
  return (
    <Box>
      <HStack className="mb-1 justify-between">
        <Text className="font-[Inter_500Medium] text-[11px] text-[#017A8C]">Matched ({matched})</Text>
        <Text className="font-[Inter_500Medium] text-[11px] text-[#88B7C4]">Missing ({missing})</Text>
      </HStack>
      <HStack className="h-2 overflow-hidden rounded">
        <Box style={{ width: `${matchedW}%`, backgroundColor: '#017A8C' }} />
        <Box style={{ flex: 1, backgroundColor: '#88B7C4' }} />
      </HStack>
    </Box>
  );
}

const TYPE_COLORS_LIGHT: Record<string, { bg: string; fg: string }> = {
  keyword: { bg: '#dbeafe', fg: '#1d4ed8' },
  phrasing: { bg: '#fef3c7', fg: '#d97706' },
  skill: { bg: '#dcfce7', fg: '#16a34a' },
  summary: { bg: '#f3e8ff', fg: '#7c3aed' },
};
const TYPE_COLORS_DARK: Record<string, { bg: string; fg: string }> = {
  keyword: { bg: '#1e3a5f', fg: '#60a5fa' },
  phrasing: { bg: '#78350f', fg: '#fbbf24' },
  skill: { bg: '#14532d', fg: '#4ade80' },
  summary: { bg: '#3b0764', fg: '#c084fc' },
};

export default function ATSScreen() {
  const { cvData, setCvData, atsResult, setAtsResult } = useCVContext();
  const { analyzeCV, isLoading: analyzing } = useGeminiATSAnalysis();
  const { generateSuggestions, applySuggestions, isLoading: optimizing } = useGeminiCVOptimizer();
  const { generateDescription, isLoading: generating } = useGeminiProfessionalBackground();
  const scheme = useColorScheme();
  const isDark = scheme === 'dark';
  const bgStroke = isDark ? '#263A52' : '#E5E7EB';
  const insets = useSafeAreaInsets();

  const [mode, setMode] = useState<'job' | 'background'>('job');
  const [jobDescription, setJobDescription] = useState('');
  const [activeJD, setActiveJD] = useState('');
  const [background, setBackground] = useState('');
  const [suggestions, setSuggestions] = useState<OptimizationSuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [analyzeError, setAnalyzeError] = useState<string | null>(null);
  const [optimizeError, setOptimizeError] = useState<string | null>(null);
  const [applying, setApplying] = useState(false);
  const [prevCvSnapshot, setPrevCvSnapshot] = useState<CVData | null>(null);
  const [prevScore, setPrevScore] = useState<number | null>(null);

  const matchColor = atsResult
    ? atsResult.matchPercentage >= 75 ? '#22c55e' : atsResult.matchPercentage >= 50 ? '#f59e0b' : '#ef4444'
    : '#017A8C';

  const summary = useMemo(() => {
    if (!suggestions.length) return null;
    return {
      total: suggestions.length,
      keyword: suggestions.filter((s) => s.type === 'keyword').length,
      phrasing: suggestions.filter((s) => s.type === 'phrasing').length,
      skill: suggestions.filter((s) => s.type === 'skill').length,
      high: suggestions.filter((s) => s.confidence === 'high').length,
    };
  }, [suggestions]);

  const handleAnalyze = async () => {
    setAnalyzeError(null);
    let jd = jobDescription;
    if (mode === 'background') {
      if (!background.trim()) { setAnalyzeError('Please enter your professional field'); return; }
      try {
        jd = await generateDescription(background);
      } catch (err: any) {
        setAnalyzeError(err.message || 'Failed to generate job description');
        return;
      }
    }
    if (!jd.trim()) { setAnalyzeError('Please provide a job description'); return; }
    try {
      const result = await analyzeCV(cvData, jd);
      setAtsResult(result);
      setActiveJD(jd);
      setShowSuggestions(false);
      setSuggestions([]);
    } catch (err: any) {
      setAnalyzeError(err.message || 'Analysis failed');
    }
  };

  const handleGetSuggestions = async () => {
    setOptimizeError(null);
    if (!activeJD.trim()) { setOptimizeError('Run an analysis first so we have a target job description.'); return; }
    try {
      const result = await generateSuggestions(cvData, activeJD);
      setSuggestions(result.suggestions.map((s) => ({ ...s, approved: s.confidence === 'high' })));
      setShowSuggestions(true);
    } catch (err: any) {
      setOptimizeError(err.message || 'Failed to generate suggestions');
    }
  };

  const toggleSuggestion = (id: string) =>
    setSuggestions((prev) => prev.map((s) => s.id === id ? { ...s, approved: !s.approved } : s));

  const selectAll = (approved: boolean) =>
    setSuggestions((prev) => prev.map((s) => ({ ...s, approved })));

  const handleApply = async () => {
    setApplying(true);
    try {
      const snapshotBefore = JSON.parse(JSON.stringify(cvData)) as CVData;
      const scoreBefore = atsResult?.matchPercentage ?? 0;
      const optimized = applySuggestions(cvData, suggestions);
      setCvData(optimized);
      let newResult = atsResult;
      if (activeJD) {
        newResult = await analyzeCV(optimized, activeJD);
        setAtsResult(newResult);
      }
      setSuggestions([]);
      setShowSuggestions(false);
      const scoreAfter = newResult?.matchPercentage ?? 0;
      if (scoreAfter < scoreBefore) {
        setPrevCvSnapshot(snapshotBefore);
        setPrevScore(scoreBefore);
        Alert.alert(
          'Score Changed',
          `Your score changed from ${scoreBefore}% to ${scoreAfter}%. AI scoring can vary between analyses — your improvements are saved. Would you like to revert?`,
          [
            { text: 'Keep Changes', style: 'default' },
            {
              text: 'Revert',
              style: 'destructive',
              onPress: () => {
                setCvData(snapshotBefore);
                if (atsResult) setAtsResult({ ...atsResult, matchPercentage: scoreBefore });
                setPrevCvSnapshot(null);
                setPrevScore(null);
              },
            },
          ],
        );
      } else {
        setPrevCvSnapshot(null);
        setPrevScore(null);
        Alert.alert('Applied', `Suggestions applied! Score: ${scoreBefore}% → ${scoreAfter}%.`);
      }
    } catch (err: any) {
      setOptimizeError(err.message || 'Failed to apply suggestions');
    } finally {
      setApplying(false);
    }
  };

  const approvedCount = suggestions.filter((s) => s.approved).length;

  return (
    <Box className="flex-1 bg-background-light dark:bg-background-dark">
      <StatusBar barStyle="light-content" backgroundColor="#015C6A" />
      <ScrollView contentContainerClassName="pb-32">
        <GradientHeader style={{ paddingHorizontal: 20, paddingTop: 56, paddingBottom: 24 }}>
          <HStack space={10} className="items-center">
            <BarChart2 size={24} color="#fff" />
            <Heading size="lg" className="font-[Inter_700Bold] tracking-tight text-white">
              ATS Optimizer
            </Heading>
          </HStack>
          <Text className="mt-1.5 font-[Inter_400Regular] text-[13px] text-[#a5d8e0]">
            Analyze and optimize your CV against job descriptions
          </Text>
        </GradientHeader>

        <Box className="p-4">
          <HStack className="mb-4 overflow-hidden rounded-2xl border border-border-light bg-card-light p-1 dark:border-border-dark dark:bg-card-dark">
            {(['job', 'background'] as const).map((m) => (
              <Pressable
                key={m}
                onPress={() => setMode(m)}
                className="flex-1 items-center overflow-hidden rounded-xl py-2.5"
              >
                {mode === m ? (
                  <LinearGradient
                    colors={['#015C6A', '#019baf']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={{ position: 'absolute', top: 0, bottom: 0, left: 0, right: 0 }}
                  />
                ) : null}
                <Text className={`font-[Inter_600SemiBold] text-[13px] ${mode === m ? 'text-white' : 'text-text-light-light dark:text-text-light-dark'}`}>
                  {m === 'job' ? 'Job Description' : 'My Field'}
                </Text>
              </Pressable>
            ))}
          </HStack>

          {mode === 'job' ? (
            <Box className="mb-4">
              <Text className="mb-2 font-[Inter_500Medium] text-xs uppercase tracking-wide text-text-dark-light dark:text-text-dark-dark">
                Paste Job Description
              </Text>
              <Input className="items-start">
                <InputField
                  value={jobDescription}
                  onChangeText={setJobDescription}
                  multiline
                  numberOfLines={6}
                  placeholder="Paste the job posting here..."
                  textAlignVertical="top"
                  className="min-h-[120px] font-[Inter_400Regular] text-[13px]"
                />
              </Input>
            </Box>
          ) : (
            <Box className="mb-4">
              <Text className="mb-2 font-[Inter_500Medium] text-xs uppercase tracking-wide text-text-dark-light dark:text-text-dark-dark">
                Your Professional Field
              </Text>
              <Input>
                <InputField
                  value={background}
                  onChangeText={setBackground}
                  placeholder="e.g. Frontend Developer, Data Scientist..."
                  className="font-[Inter_400Regular]"
                />
              </Input>
            </Box>
          )}

          {analyzeError && (
            <HStack space={8} style={{ marginBottom: 12, alignItems: 'center', borderRadius: 8, borderWidth: 1, borderColor: isDark ? '#7f1d1d' : '#fecaca', backgroundColor: isDark ? '#450a0a' : '#fef2f2', padding: 12 }}>
              <AlertCircle size={16} color={isDark ? '#f87171' : '#ef4444'} />
              <Text style={{ flex: 1, fontFamily: 'Inter_500Medium', fontSize: 12, color: isDark ? '#f87171' : '#b91c1c' }}>{analyzeError}</Text>
            </HStack>
          )}

          <Button className="mb-3" isLoading={analyzing || generating} onPress={handleAnalyze}>
            <ButtonText className="font-[Inter_700Bold] text-[15px]">Analyze CV</ButtonText>
          </Button>

          {atsResult && (
            <VStack>
              <Card className="mb-3 rounded-2xl p-5">
                <Text className="mb-3 text-center font-[Inter_500Medium] text-[13px] text-text-light-light dark:text-text-light-dark">ATS Match Score</Text>
                <Center className="mb-4" style={{ position: 'relative' }}>
                  <LinearGradient
                    colors={
                      atsResult.matchPercentage >= 75
                        ? ['#dcfce7', '#f0fdf4']
                        : atsResult.matchPercentage >= 50
                          ? ['#fef3c7', '#fffbeb']
                          : ['#fef2f2', '#fff5f5']
                    }
                    style={{ position: 'absolute', width: 154, height: 154, borderRadius: 77, opacity: 0.8 }}
                  />
                  <DonutScore value={atsResult.matchPercentage} color={matchColor} bgStroke={bgStroke} />
                </Center>
                <KeywordBar
                  matched={atsResult.keywordMatches.matched.length}
                  missing={atsResult.keywordMatches.missing.length}
                />
              </Card>

              {atsResult.strengths.length > 0 && (
                <Card className="mb-2.5 rounded-xl">
                  <HStack space={8} className="mb-2.5 items-center">
                    <CheckCircle2 size={18} color="#22c55e" />
                    <Text className="font-[Inter_600SemiBold] text-sm text-text-dark-light dark:text-text-dark-dark">
                      Strengths
                    </Text>
                  </HStack>
                  {atsResult.strengths.map((s, i) => (
                    <Text key={i} className="mb-1 font-[Inter_400Regular] text-[13px] leading-5 text-text-dark-light dark:text-text-dark-dark">• {s}</Text>
                  ))}
                </Card>
              )}

              {atsResult.weaknesses.length > 0 && (
                <Card className="mb-2.5 rounded-xl">
                  <HStack space={8} className="mb-2.5 items-center">
                    <XCircle size={18} color="#ef4444" />
                    <Text className="font-[Inter_600SemiBold] text-sm text-text-dark-light dark:text-text-dark-dark">
                      Areas to Improve
                    </Text>
                  </HStack>
                  {atsResult.weaknesses.map((w, i) => (
                    <Text key={i} className="mb-1 font-[Inter_400Regular] text-[13px] leading-5 text-text-dark-light dark:text-text-dark-dark">• {w}</Text>
                  ))}
                </Card>
              )}

              {atsResult.recommendations && atsResult.recommendations.length > 0 && (
                <Card className="mb-2.5 rounded-xl">
                  <HStack space={8} className="mb-2.5 items-center">
                    <Sparkles size={18} color="#7c3aed" />
                    <Text className="font-[Inter_600SemiBold] text-sm text-text-dark-light dark:text-text-dark-dark">
                      Recommendations
                    </Text>
                  </HStack>
                  {atsResult.recommendations.map((r, i) => (
                    <Text key={i} className="mb-1 font-[Inter_400Regular] text-[13px] leading-5 text-text-dark-light dark:text-text-dark-dark">• {r}</Text>
                  ))}
                </Card>
              )}

              {atsResult.keywordMatches.matched.length > 0 && (
                <Card className="mb-2.5 rounded-xl">
                  <Text className="mb-2 font-[Inter_600SemiBold] text-sm text-text-dark-light dark:text-text-dark-dark">
                    Matched Keywords
                  </Text>
                  <HStack className="flex-wrap gap-1.5">
                    {atsResult.keywordMatches.matched.map((kw, i) => (
                      <Box key={i} style={{ borderRadius: 6, borderWidth: 1, borderColor: isDark ? '#166534' : '#bbf7d0', backgroundColor: isDark ? '#14532d' : '#f0fdf4', paddingHorizontal: 10, paddingVertical: 4 }}>
                        <Text style={{ fontFamily: 'Inter_500Medium', fontSize: 12, color: isDark ? '#4ade80' : '#16a34a' }}>{kw}</Text>
                      </Box>
                    ))}
                  </HStack>
                </Card>
              )}

              {atsResult.keywordMatches.missing.length > 0 && (
                <Card className="mb-2.5 rounded-xl">
                  <Text className="mb-2 font-[Inter_600SemiBold] text-sm text-text-dark-light dark:text-text-dark-dark">
                    Missing Keywords
                  </Text>
                  <HStack className="flex-wrap gap-1.5">
                    {atsResult.keywordMatches.missing.map((kw, i) => (
                      <Box key={i} style={{ borderRadius: 6, borderWidth: 1, borderColor: isDark ? '#7f1d1d' : '#fecaca', backgroundColor: isDark ? '#450a0a' : '#fef2f2', paddingHorizontal: 10, paddingVertical: 4 }}>
                        <Text style={{ fontFamily: 'Inter_500Medium', fontSize: 12, color: isDark ? '#f87171' : '#dc2626' }}>{kw}</Text>
                      </Box>
                    ))}
                  </HStack>
                </Card>
              )}

              {optimizeError && (
                <HStack space={8} style={{ marginBottom: 12, alignItems: 'center', borderRadius: 8, borderWidth: 1, borderColor: isDark ? '#7f1d1d' : '#fecaca', backgroundColor: isDark ? '#450a0a' : '#fef2f2', padding: 12 }}>
                  <AlertCircle size={16} color={isDark ? '#f87171' : '#ef4444'} />
                  <Text style={{ flex: 1, fontFamily: 'Inter_500Medium', fontSize: 12, color: isDark ? '#f87171' : '#b91c1c' }}>{optimizeError}</Text>
                </HStack>
              )}

              {!showSuggestions && (
                <Pressable
                  onPress={handleGetSuggestions}
                  disabled={optimizing}
                  className={`mb-3 flex-row items-center justify-center gap-2 rounded-xl bg-primary-light py-3.5 ${optimizing ? 'opacity-60' : ''}`}
                >
                  {optimizing ? <Spinner size="small" color="#fff" /> : <Lightbulb size={18} color="#fff" />}
                  <Text className="font-[Inter_700Bold] text-sm text-white">
                    {optimizing ? 'Generating...' : 'Get Optimization Suggestions'}
                  </Text>
                </Pressable>
              )}

              {showSuggestions && suggestions.length > 0 && (
                <Card className="mb-3 rounded-xl">
                  {summary && (
                    <HStack className="mb-3 flex-wrap gap-2">
                      {([
                        ['Total', summary.total, '#017A8C'],
                        ['Keyword', summary.keyword, '#1d4ed8'],
                        ['Phrasing', summary.phrasing, '#d97706'],
                        ['Skill', summary.skill, '#16a34a'],
                        ['High Conf.', summary.high, '#7c3aed'],
                      ] as const).map(([label, val, color]) => (
                        <Box key={label} className="rounded-lg border border-border-light px-2.5 py-1.5 dark:border-border-dark">
                          <Text className="font-[Inter_400Regular] text-[10px] uppercase tracking-wide text-text-light-light dark:text-text-light-dark">{label}</Text>
                          <Text className="font-[Inter_700Bold] text-base" style={{ color }}>{val}</Text>
                        </Box>
                      ))}
                    </HStack>
                  )}

                  <HStack className="mb-3 items-center justify-between">
                    <Text className="font-[Inter_600SemiBold] text-[14px] text-text-dark-light dark:text-text-dark-dark">
                      {approvedCount}/{suggestions.length} selected
                    </Text>
                    <HStack space={6}>
                      <Pressable onPress={() => selectAll(true)} className="rounded-md border border-primary px-2.5 py-1">
                        <Text className="font-[Inter_500Medium] text-[11px] text-primary">Select all</Text>
                      </Pressable>
                      <Pressable onPress={() => selectAll(false)} className="rounded-md border border-border-light px-2.5 py-1 dark:border-border-dark">
                        <Text className="font-[Inter_500Medium] text-[11px] text-text-light-light dark:text-text-light-dark">Clear</Text>
                      </Pressable>
                    </HStack>
                  </HStack>

                  {suggestions.map((suggestion) => {
                    const tc = (isDark ? TYPE_COLORS_DARK : TYPE_COLORS_LIGHT)[suggestion.type]
                      || (isDark ? TYPE_COLORS_DARK : TYPE_COLORS_LIGHT).keyword;
                    return (
                      <Pressable
                        key={suggestion.id}
                        onPress={() => toggleSuggestion(suggestion.id)}
                        className={`mb-3 rounded-lg border p-3 ${suggestion.approved ? 'border-primary bg-primary/10' : 'border-border-light bg-background-light dark:border-border-dark dark:bg-background-dark'}`}
                      >
                        <HStack space={8} className="mb-1.5 items-start">
                          <Center className={`mt-0.5 h-5 w-5 rounded border-2 ${suggestion.approved ? 'border-primary bg-primary' : 'border-border-light dark:border-border-dark'}`}>
                            {suggestion.approved && <Text className="text-[10px] text-white">✓</Text>}
                          </Center>
                          <Box className="flex-1">
                            <HStack space={4} className="mb-1 flex-wrap items-center">
                              <Box style={{ borderRadius: 4, paddingHorizontal: 6, paddingVertical: 2, backgroundColor: tc.bg }}>
                                <RNText style={{ fontFamily: 'Inter_500Medium', fontSize: 9, textTransform: 'uppercase', color: tc.fg }}>{suggestion.type}</RNText>
                              </Box>
                              <Box style={{
                                borderRadius: 4,
                                paddingHorizontal: 6,
                                paddingVertical: 2,
                                backgroundColor: suggestion.confidence === 'high'
                                  ? (isDark ? '#14532d' : '#dcfce7')
                                  : suggestion.confidence === 'medium'
                                    ? (isDark ? '#78350f' : '#fef3c7')
                                    : (isDark ? '#1e293b' : '#f3f4f6'),
                              }}>
                                <Text style={{
                                  fontFamily: 'Inter_500Medium',
                                  fontSize: 9,
                                  textTransform: 'uppercase',
                                  color: suggestion.confidence === 'high'
                                    ? (isDark ? '#4ade80' : '#16a34a')
                                    : suggestion.confidence === 'medium'
                                      ? (isDark ? '#fbbf24' : '#d97706')
                                      : (isDark ? '#94a3b8' : '#6b7280'),
                                }}>
                                  {suggestion.confidence}
                                </Text>
                              </Box>
                              <Text className="font-[Inter_400Regular] text-[10px] text-text-light-light dark:text-text-light-dark">{suggestion.section}</Text>
                            </HStack>
                            <Text className="font-[Inter_600SemiBold] text-[13px] text-text-dark-light dark:text-text-dark-dark">
                              {suggestion.title}
                            </Text>
                          </Box>
                        </HStack>

                        {suggestion.original ? (
                          <Box style={{ marginBottom: 6, overflow: 'hidden', borderRadius: 6, backgroundColor: isDark ? '#450a0a' : '#fef2f2', padding: 8, borderLeftWidth: 3, borderLeftColor: '#dc2626' }}>
                            <Text style={{ marginBottom: 2, fontFamily: 'Inter_600SemiBold', fontSize: 9, textTransform: 'uppercase', letterSpacing: 1, color: isDark ? '#fca5a5' : '#b91c1c' }}>Before</Text>
                            <Text style={{ fontFamily: 'Inter_400Regular', fontSize: 12, lineHeight: 16, color: isDark ? '#fecaca' : '#7f1d1d' }}>{suggestion.original}</Text>
                          </Box>
                        ) : null}
                        <Box style={{ marginBottom: 6, overflow: 'hidden', borderRadius: 6, backgroundColor: isDark ? '#052e16' : '#f0fdf4', padding: 8, borderLeftWidth: 3, borderLeftColor: '#16a34a' }}>
                          <Text style={{ marginBottom: 2, fontFamily: 'Inter_600SemiBold', fontSize: 9, textTransform: 'uppercase', letterSpacing: 1, color: isDark ? '#86efac' : '#15803d' }}>After</Text>
                          <Text style={{ fontFamily: 'Inter_400Regular', fontSize: 12, lineHeight: 16, color: isDark ? '#bbf7d0' : '#14532d' }}>{suggestion.suggested}</Text>
                        </Box>
                        <HStack space={4} className="items-start">
                          <Lightbulb size={12} color="#88B7C4" />
                          <Text className="flex-1 font-[Inter_400Regular] text-[11px] italic text-text-light-light dark:text-text-light-dark">
                            {suggestion.reason}
                          </Text>
                        </HStack>
                      </Pressable>
                    );
                  })}
                </Card>
              )}
            </VStack>
          )}
        </Box>
      </ScrollView>

      {showSuggestions && suggestions.length > 0 && (
        <Box className="absolute left-0 right-0 border-t border-border-light bg-surface-light p-3 dark:border-border-dark dark:bg-surface-dark" style={{ bottom: insets.bottom + 92 }}>
          <Pressable
            onPress={handleApply}
            disabled={applying || approvedCount === 0}
            className={`flex-row items-center justify-center gap-2 rounded-xl bg-primary py-3.5 ${applying || approvedCount === 0 ? 'opacity-60' : ''}`}
          >
            {applying ? <Spinner size="small" color="#fff" /> : <Wand2 size={18} color="#fff" />}
            <Text className="font-[Inter_700Bold] text-sm text-white">
              {applying ? 'Applying & re-analyzing...' : `Apply Changes (${approvedCount}/${suggestions.length})`}
            </Text>
          </Pressable>
        </Box>
      )}
    </Box>
  );
}
