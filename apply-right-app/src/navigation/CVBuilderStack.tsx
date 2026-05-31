import { createStackNavigator } from '@react-navigation/stack';
import TemplateSelectScreen from '../screens/cv/TemplateSelectScreen';
import CVBuilderScreen from '../screens/cv/CVBuilderScreen';
import CVPreviewScreen from '../screens/cv/CVPreviewScreen';

export type CVBuilderStackParamList = {
  TemplateSelect: undefined;
  CVBuilder: { templateId?: string; cvId?: string };
  CVPreview: undefined;
};

const Stack = createStackNavigator<CVBuilderStackParamList>();

export default function CVBuilderStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="TemplateSelect" component={TemplateSelectScreen} options={{ title: 'Choose Template' }} />
      <Stack.Screen name="CVBuilder" component={CVBuilderScreen} options={{ title: 'Build Your CV' }} />
      <Stack.Screen name="CVPreview" component={CVPreviewScreen} options={{ title: 'CV Preview' }} />
    </Stack.Navigator>
  );
}
