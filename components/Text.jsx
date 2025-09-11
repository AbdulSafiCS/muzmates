import { Text as DefaultText } from "react-native";

const Text = (props) => {
  return (
    <DefaultText
      {...props}
      style={[
        // The style from props should take precedence, so we apply it first.
        { fontFamily: "Poppins_400Regular" }, // Default font
        props.style, // Allow overriding the default font
      ]}
    />
  );
};

export default Text;
