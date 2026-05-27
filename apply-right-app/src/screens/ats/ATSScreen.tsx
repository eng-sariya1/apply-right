import { useState } from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity, Alert, ActivityIndicator, StatusBar } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { useCVContext } from '../../context/CVContext';
import { useGeminiATSAnalysis } from '../../hooks/useGeminiATSAnalysis';
import { useGeminiCVOptimizer } from '../../hooks/useGeminiCVOptimizer';
import { useGeminiProfessionalBackground } from '../../hooks/useGeminiProfessionalBackground';
import { BarChart2, CheckCircle2, XCircle, Lightbulb, Wand2, ToggleLeft, ToggleRight } from 'lucide-react-native';
import type { OptimizationSuggestion } from '../../types/cv.types';

export default function ATSScreen() {
  const { colors } = useTheme();
  const { cvData, setCvData, atsResult, setAtsResult } = useCVContext();
  const { analyzeCV, isLoading: analyzing } = useGeminiATSAnalysis();
  const { generateSuggestions, applySuggestions, isLoading: optimizing } = useGeminiCVOptimizer();
  const { generateDescription, isLoading: generating } = useGeminiProfessionalBackground();

  const [mode, setMode] = useState<'job' | 'background'>('job');
  const [jobDescription, setJobDescription] = useState('');
  const [background, setBackground] = useState('');
  const [suggestions, setSuggestions] = useState<OptimizationSuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const handleAnalyze = async () => {
    let jd = jobDescription;
    if (mode === 'background') {
      if (!background.trim()) { Alert.alert('Error', 'Please enter your professional field'); return; }
      jd = await generateDescription(background).catch(() => '');
    }
    if (!jd.trim()) { Alert.alert('Error', 'Please provide a job description'); return; }
    try {
      const result = await analyzeCV(cvData, jd);
      setAtsResult(result);
      setShowSuggestions(false);
    } catch (err: any) {
      Alert.alert('Error', err.message || 'Analysis failed');
    }
  };

  const handleGetSuggestions = async () => {
    const jd = jobDescription;
    if (!jd.trim()) { Alert.alert('Error', 'Please provide a job description first'); return; }
    try {
      const result = await generateSuggestions(cvData, jd);
      setSuggestions(result.suggestions);
      setShowSuggestions(true);
    } catch (err: any) {
      Alert.alert('Error', err.message || 'Failed to generate suggestions');
    }
  };

  const toggleSuggestion = (id: string) => {
    setSuggestions((prev) => prev.map((s) => s.id === id ? { ...s, approved: !s.approved } : s));
  };

  const handleApply = () => {
    const optimized = applySuggestions(cvData, suggestions);
    setCvData(optimized);
    Alert.alert('Applied!', `${suggestions.filter((s) => s.approved).length} suggestions applied to your CV.`);
    setSuggestions([]);
    setShowSuggestions(false);
  };

  const matchColor = atsResult ? (atsResult.matchPercentage >= 75 ? '#22c55e' : atsResult.matchPercentage >= 50 ? '#f59e0b' : '#ef4444') : colors.primary;

  return (
    <ScrollView style={{ flex: 1, backgroundColor: colors.background }} contentContainerStyle={{ paddingBottom: 40 }}>
      <StatusBar barStyle="light-content" backgroundColor={colors.primaryDark} />

      {/* Header */}
      <View style={{ backgroundColor: colors.primaryDark, paddingTop: 56, paddingBottom: 24, paddingHorizontal: 20 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
          <BarChart2 size={24} color="#fff" />
          <Text style={{ fontSize: 22, fontWeight: '700', color: '#fff', fontFamily: 'Ubuntu_700Bold' }}>ATS Optimizer</Text>
        </View>
        <Text style={{ color: '#a5d8e0', marginTop: 6, fontFamily: 'Ubuntu_300Light', fontSize: 13 }}>
          Analyze and optimize your CV against job descriptions
        </Text>
      </View>

      <View style={{ padding: 16 }}>
        {/* Mode toggle */}
        <View style={{ flexDirection: 'row', backgroundColor: colors.surface, borderRadius: 10, padding: 4, marginBottom: 16, borderWidth: 1, borderColor: colors.border }}>
          {(['job', 'background'] as const).map((m) => (
            <TouchableOpacity
              key={m}
              onPress={() => setMode(m)}
              style={{ flex: 1, paddingVertical: 9, alignItems: 'center', borderRadius: 8, backgroundColor: mode === m ? colors.primary : 'transparent' }}
            >
              <Text style={{ fontSize: 13, fontFamily: 'Ubuntu_500Medium', color: mode === m ? '#fff' : colors.textLight }}>
                {m === 'job' ? 'Job Description' : 'My Field'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Input */}
        {mode === 'job' ? (
          <View style={{ marginBottom: 16 }}>
            <Text style={{ fontSize: 13, fontWeight: '600', color: colors.textDark, fontFamily: 'Ubuntu_500Medium', marginBottom: 8 }}>Paste Job Description</Text>
            <TextInput
              value={jobDescription}
              onChangeText={setJobDescription}
              multiline
              numberOfLines={6}
              placeholder="Paste the job posting here..."
              placeholderTextColor={colors.textLight}
              style={{ backgroundColor: colors.surface, borderWidth: 1.5, borderColor: colors.border, borderRadius: 10, padding: 12, fontSize: 13, color: colors.textDark, fontFamily: 'Ubuntu_300Light', minHeight: 120, textAlignVertical: 'top' }}
            />
          </View>
        ) : (
          <View style={{ marginBottom: 16 }}>
            <Text style={{ fontSize: 13, fontWeight: '600', color: colors.textDark, fontFamily: 'Ubuntu_500Medium', marginBottom: 8 }}>Your Professional Field</Text>
            <TextInput
              value={background}
              onChangeText={setBackground}
              placeholder="e.g. Frontend Developer, Data Scientist..."
              placeholderTextColor={colors.textLight}
              style={{ backgroundColor: colors.surface, borderWidth: 1.5, borderColor: colors.border, borderRadius: 10, paddingHorizontal: 14, paddingVertical: 12, fontSize: 14, color: colors.textDark, fontFamily: 'Ubuntu_300Light' }}
            />
          </View>
        )}

        <TouchableOpacity
          onPress={handleAnalyze}
          disabled={analyzing || generating}
          style={{ backgroundColor: colors.primary, borderRadius: 10, paddingVertical: 14, alignItems: 'center', marginBottom: 12, opacity: (analyzing || generating) ? 0.7 : 1 }}
        >
          {(analyzing || generating) ? <ActivityIndicator color="#fff" /> : <Text style={{ color: '#fff', fontFamily: 'Ubuntu_700Bold', fontSize: 15 }}>Analyze CV</Text>}
        </TouchableOpacity>

        {/* Results */}
        {atsResult && (
          <View>
            {/* Score */}
            <View style={{ backgroundColor: colors.surface, borderRadius: 14, padding: 20, marginBottom: 12, borderWidth: 1, borderColor: colors.border, alignItems: 'center' }}>
              <Text style={{ fontSize: 13, color: colors.textLight, fontFamily: 'Ubuntu_300Light', marginBottom: 8 }}>ATS Match Score</Text>
              <View style={{ width: 100, height: 100, borderRadius: 50, borderWidth: 8, borderColor: matchColor, justifyContent: 'center', alignItems: 'center', marginBottom: 12 }}>
                <Text style={{ fontSize: 28, fontWeight: '700', color: matchColor, fontFamily: 'Ubuntu_700Bold' }}>{atsResult.matchPercentage}%</Text>
              </View>
              <View style={{ width: '100%', height: 6, backgroundColor: colors.border, borderRadius: 3 }}>
                <View style={{ width: `${atsResult.matchPercentage}%` as any, height: 6, backgroundColor: matchColor, borderRadius: 3 }} />
              </View>
            </View>

            {/* Strengths */}
            {atsResult.strengths.length > 0 && (
              <View style={{ backgroundColor: colors.surface, borderRadius: 12, padding: 16, marginBottom: 10, borderWidth: 1, borderColor: colors.border }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                  <CheckCircle2 size={18} color="#22c55e" />
                  <Text style={{ fontSize: 14, fontWeight: '600', color: colors.textDark, fontFamily: 'Ubuntu_500Medium' }}>Strengths</Text>
                </View>
                {atsResult.strengths.map((s, i) => (
                  <Text key={i} style={{ fontSize: 13, color: '#444', fontFamily: 'Ubuntu_300Light', lineHeight: 20, marginBottom: 4 }}>• {s}</Text>
                ))}
              </View>
            )}

            {/* Weaknesses */}
            {atsResult.weaknesses.length > 0 && (
              <View style={{ backgroundColor: colors.surface, borderRadius: 12, padding: 16, marginBottom: 10, borderWidth: 1, borderColor: colors.border }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                  <XCircle size={18} color="#ef4444" />
                  <Text style={{ fontSize: 14, fontWeight: '600', color: colors.textDark, fontFamily: 'Ubuntu_500Medium' }}>Areas to Improve</Text>
                </View>
                {atsResult.weaknesses.map((w, i) => (
                  <Text key={i} style={{ fontSize: 13, color: '#444', fontFamily: 'Ubuntu_300Light', lineHeight: 20, marginBottom: 4 }}>• {w}</Text>
                ))}
              </View>
            )}

            {/* Keywords */}
            {atsResult.keywordMatches.missing.length > 0 && (
              <View style={{ backgroundColor: colors.surface, borderRadius: 12, padding: 16, marginBottom: 10, borderWidth: 1, borderColor: colors.border }}>
                <Text style={{ fontSize: 14, fontWeight: '600', color: colors.textDark, fontFamily: 'Ubuntu_500Medium', marginBottom: 8 }}>Missing Keywords</Text>
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6 }}>
                  {atsResult.keywordMatches.missing.map((kw, i) => (
                    <View key={i} style={{ backgroundColor: '#fef2f2', borderRadius: 6, paddingHorizontal: 10, paddingVertical: 4, borderWidth: 1, borderColor: '#fecaca' }}>
                      <Text style={{ fontSize: 12, color: '#ef4444', fontFamily: 'Ubuntu_500Medium' }}>{kw}</Text>
                    </View>
                  ))}
                </View>
              </View>
            )}

            {/* Get Suggestions Button */}
            {mode === 'job' && !showSuggestions && (
              <TouchableOpacity
                onPress={handleGetSuggestions}
                disabled={optimizing}
                style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: colors.primaryLight, borderRadius: 10, paddingVertical: 13, marginBottom: 12, opacity: optimizing ? 0.7 : 1 }}
              >
                {optimizing ? <ActivityIndicator color="#fff" size="small" /> : <Lightbulb size={18} color="#fff" />}
                <Text style={{ color: '#fff', fontFamily: 'Ubuntu_700Bold', fontSize: 14 }}>
                  {optimizing ? 'Generating...' : 'Get Optimization Suggestions'}
                </Text>
              </TouchableOpacity>
            )}

            {/* Suggestions */}
            {showSuggestions && suggestions.length > 0 && (
              <View style={{ backgroundColor: colors.surface, borderRadius: 12, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: colors.border }}>
                <Text style={{ fontSize: 15, fontWeight: '700', color: colors.textDark, fontFamily: 'Ubuntu_700Bold', marginBottom: 12 }}>
                  Suggestions ({suggestions.filter((s) => s.approved).length}/{suggestions.length} selected)
                </Text>
                {suggestions.map((suggestion) => (
                  <TouchableOpacity
                    key={suggestion.id}
                    onPress={() => toggleSuggestion(suggestion.id)}
                    style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 10, marginBottom: 12, padding: 10, borderRadius: 8, backgroundColor: suggestion.approved ? `${colors.primary}10` : colors.background, borderWidth: 1, borderColor: suggestion.approved ? colors.primary : colors.border }}
                  >
                    <View style={{ width: 20, height: 20, borderRadius: 10, borderWidth: 2, borderColor: suggestion.approved ? colors.primary : colors.border, backgroundColor: suggestion.approved ? colors.primary : 'transparent', justifyContent: 'center', alignItems: 'center', marginTop: 2 }}>
                      {suggestion.approved && <Text style={{ color: '#fff', fontSize: 12 }}>✓</Text>}
                    </View>
                    <View style={{ flex: 1 }}>
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                        <Text style={{ fontSize: 13, fontWeight: '600', color: colors.textDark, fontFamily: 'Ubuntu_500Medium', flex: 1 }}>{suggestion.title}</Text>
                        <View style={{ backgroundColor: suggestion.confidence === 'high' ? '#dcfce7' : suggestion.confidence === 'medium' ? '#fef3c7' : '#f3f4f6', borderRadius: 6, paddingHorizontal: 6, paddingVertical: 2 }}>
                          <Text style={{ fontSize: 10, color: suggestion.confidence === 'high' ? '#16a34a' : suggestion.confidence === 'medium' ? '#d97706' : '#6b7280', fontFamily: 'Ubuntu_500Medium' }}>
                            {suggestion.confidence.toUpperCase()}
                          </Text>
                        </View>
                      </View>
                      <Text style={{ fontSize: 12, color: colors.textLight, fontFamily: 'Ubuntu_300Light' }}>{suggestion.reason}</Text>
                    </View>
                  </TouchableOpacity>
                ))}

                <TouchableOpacity
                  onPress={handleApply}
                  style={{ backgroundColor: colors.primary, borderRadius: 10, paddingVertical: 13, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 }}
                >
                  <Wand2 size={18} color="#fff" />
                  <Text style={{ color: '#fff', fontFamily: 'Ubuntu_700Bold', fontSize: 14 }}>Apply Selected ({suggestions.filter((s) => s.approved).length})</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        )}
      </View>
    </ScrollView>
  );
}
