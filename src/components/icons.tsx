import { HugeiconsIcon, type HugeiconsIconProps } from "@hugeicons/react";
import {
  AlertCircleIcon,
  ArrowDown01Icon,
  ArrowLeft01Icon,
  ArrowRight01Icon,
  ArrowUpRight01Icon,
  Banknote as BanknoteIcon,
  Bicycle01Icon,
  CalendarCheckIcon,
  Cancel01Icon,
  CheckmarkBadge01Icon,
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  CircleIcon,
  Clock01Icon,
  Copy01Icon,
  FileClockIcon,
  HeadsetIcon,
  Location01Icon,
  Logout01Icon,
  Menu01Icon,
  MapPinIcon,
  Moon02Icon,
  PercentIcon,
  Search01Icon,
  ShoppingBag01Icon,
  SlidersHorizontalIcon,
  StarIcon,
  Store01Icon,
  SunIcon,
  Tick01Icon,
  Wallet01Icon,
} from "@hugeicons/core-free-icons";
import { forwardRef } from "react";

type IconProps = Omit<HugeiconsIconProps, "icon">;

function createIcon(
  icon: HugeiconsIconProps["icon"],
  displayName: string,
) {
  const Icon = forwardRef<SVGSVGElement, IconProps>(
    ({ strokeWidth = 1.5, color = "currentColor", ...props }, ref) => (
      <HugeiconsIcon
        ref={ref}
        icon={icon}
        strokeWidth={strokeWidth}
        color={color}
        {...props}
      />
    ),
  );

  Icon.displayName = displayName;
  return Icon;
}

export const AlertCircle = createIcon(AlertCircleIcon, "AlertCircle");
export const ArrowDown = createIcon(ArrowDown01Icon, "ArrowDown");
export const ArrowLeft = createIcon(ArrowLeft01Icon, "ArrowLeft");
export const ArrowRight = createIcon(ArrowRight01Icon, "ArrowRight");
export const ArrowUpRight = createIcon(ArrowUpRight01Icon, "ArrowUpRight");
export const BadgeCheck = createIcon(CheckmarkBadge01Icon, "BadgeCheck");
export const Banknote = createIcon(BanknoteIcon, "Banknote");
export const Bike = createIcon(Bicycle01Icon, "Bike");
export const CalendarCheck = createIcon(CalendarCheckIcon, "CalendarCheck");
export const Check = createIcon(Tick01Icon, "Check");
export const ChevronDown = createIcon(ChevronDownIcon, "ChevronDown");
export const ChevronLeft = createIcon(ChevronLeftIcon, "ChevronLeft");
export const ChevronRight = createIcon(ChevronRightIcon, "ChevronRight");
export const Circle = createIcon(CircleIcon, "Circle");
export const CircleAlert = createIcon(AlertCircleIcon, "CircleAlert");
export const Clock = createIcon(Clock01Icon, "Clock");
export const Copy = createIcon(Copy01Icon, "Copy");
export const FileClock = createIcon(FileClockIcon, "FileClock");
export const Headset = createIcon(HeadsetIcon, "Headset");
export const LogOut = createIcon(Logout01Icon, "LogOut");
export const MapPin = createIcon(MapPinIcon, "MapPin");
export const MapPinned = createIcon(Location01Icon, "MapPinned");
export const Menu = createIcon(Menu01Icon, "Menu");
export const Moon = createIcon(Moon02Icon, "Moon");
export const Percent = createIcon(PercentIcon, "Percent");
export const Search = createIcon(Search01Icon, "Search");
export const ShoppingBag = createIcon(ShoppingBag01Icon, "ShoppingBag");
export const SlidersHorizontal = createIcon(
  SlidersHorizontalIcon,
  "SlidersHorizontal",
);
export const Star = createIcon(StarIcon, "Star");
export const Store = createIcon(Store01Icon, "Store");
export const Sun = createIcon(SunIcon, "Sun");
export const Wallet = createIcon(Wallet01Icon, "Wallet");
export const X = createIcon(Cancel01Icon, "X");
