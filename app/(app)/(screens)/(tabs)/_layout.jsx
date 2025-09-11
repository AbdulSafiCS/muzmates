import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Tabs } from "expo-router";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: true,
        tabBarActiveTintColor: "#90bc3b",
        tabBarStyle: {
          paddingHorizontal: 35,
        },
      }}
    >
      <Tabs.Screen
        name="Home"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => (
            <FontAwesome size={28} name="home" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="Listings"
        options={{
          title: "Listings",
          tabBarButton: () => null,
        }}
      />

      <Tabs.Screen
        name="DeleteUser"
        options={{
          title: "Delete Account",
          tabBarButton: () => null,
        }}
      />
      <Tabs.Screen
        name="EditListing"
        options={{
          title: "Edit Listing",
          tabBarButton: () => null,
        }}
      />
      <Tabs.Screen
        name="AddListing"
        options={{
          title: "Add Listing",
          tabBarButton: () => null,
        }}
      />
      <Tabs.Screen
        name="ImageGallery"
        options={{
          title: "Image Gallery",
          tabBarButton: () => null,
        }}
      />
      <Tabs.Screen
        name="Profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color }) => (
            <FontAwesome size={28} name="user" color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
