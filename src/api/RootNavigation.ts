// RootNavigation.ts
import {
  createNavigationContainerRef,
  CommonActions,
} from "@react-navigation/native";

export type RootStackParamList = {
  Login: undefined;
  Home: undefined;
  Profile: { userId: string };
};

export const navigationRef = createNavigationContainerRef<RootStackParamList>();

// ✅ Helper: Navigate
export function navigate<Name extends keyof RootStackParamList>(
  name: Name,
  params?: RootStackParamList[Name]
) {
  if (navigationRef.isReady()) {
   //navigationRef.navigate(name, params);
  }
}

// ✅ Helper: Logout (global)
export function resetToLogin() {
  if (navigationRef.isReady()) {
    navigationRef.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: "Login" }],
      })
    );
  }
}
