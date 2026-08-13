import { useState } from "react";
import { cn } from "../utils/cn";
import { getAvatarColorByIndex } from "../utils/avatarColor";

interface UserAvatarProps {
  name: string;
  imageUrl?: string | null;
  colorIndex?: number;
  className?: string;
}

const normalizeImageUrl = (value?: string | null) => {
  const normalized = value?.trim();

  if (!normalized || normalized === "null" || normalized === "undefined") {
    return null;
  }

  try {
    const url = new URL(normalized);

    if (url.protocol === "http:") {
      url.protocol = "https:";
    }

    return url.toString();
  } catch {
    return normalized;
  }
};

export const UserAvatar = ({
  name,
  imageUrl,
  colorIndex = 0,
  className,
}: UserAvatarProps) => {
  const normalizedImageUrl = normalizeImageUrl(imageUrl);
  const [failedImageUrl, setFailedImageUrl] = useState<string | null>(null);
  const canShowImage =
    normalizedImageUrl && normalizedImageUrl !== failedImageUrl;

  if (canShowImage) {
    return (
      <img
        src={normalizedImageUrl}
        alt=""
        referrerPolicy="no-referrer"
        onError={() => setFailedImageUrl(normalizedImageUrl)}
        className={cn("shrink-0 rounded-full object-cover", className)}
      />
    );
  }

  return (
    <span
      aria-hidden="true"
      className={cn(
        "flex shrink-0 items-center justify-center rounded-full font-normal text-gray-50",
        getAvatarColorByIndex(colorIndex),
        className,
      )}
    >
      {name.trim().charAt(0) || "?"}
    </span>
  );
};
