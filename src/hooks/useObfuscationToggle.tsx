import { useState } from "react";
import { Eye, EyeClosed } from "lucide-react";

export default function useObfuscationToggle() {
  const [visible, setVisible] = useState(false);
  const Icon = visible ? <EyeClosed /> : <Eye />;
  const InputType = visible ? "text" : "password";

  return [InputType, Icon, setVisible] as const;
}
