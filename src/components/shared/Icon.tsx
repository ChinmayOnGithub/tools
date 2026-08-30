import { 
  FileText, 
  Image as ImageIcon, 
  Terminal, 
  Hash, 
  Calculator, 
  RefreshCw, 
  Sliders, 
  Code, 
  List, 
  Key, 
  Calendar, 
  Scale, 
  Braces, 
  Barcode, 
  QrCode, 
  Lock, 
  Type, 
  CaseSensitive, 
  Binary, 
  Fingerprint, 
  Scissors, 
  Combine, 
  FileImage, 
  Crop, 
  Timer, 
  Clock, 
  Hourglass, 
  Ruler, 
  Layers,
  Globe,
  CloudSun,
  Coins,
  MapPin,
  CalendarDays,
  Sparkles,
  Server,
  Package,
  LucideProps 
} from 'lucide-react';

const ICON_MAP = {
  FileText,
  Image: ImageIcon,
  Terminal,
  Hash,
  Calculator,
  RefreshCw,
  Sliders,
  Code,
  List,
  Key,
  Calendar,
  Scale,
  Braces,
  Barcode,
  QrCode,
  Lock,
  Type,
  CaseSensitive,
  Binary,
  Fingerprint,
  Scissors,
  Combine,
  FileImage,
  Crop,
  Stopwatch: Timer,
  Timer,
  Clock,
  Hourglass,
  Ruler,
  Layers,
  Globe,
  CloudSun,
  Coins,
  MapPin,
  CalendarDays,
  Sparkles,
  Server,
  Package,
};

export type IconName = keyof typeof ICON_MAP;

interface IconProps extends Omit<LucideProps, 'ref'> {
  name: IconName;
}

export function Icon({ name, ...props }: IconProps) {
  const IconComponent = ICON_MAP[name];
  if (!IconComponent) return null;
  return <IconComponent {...props} />;
}

export default Icon;
