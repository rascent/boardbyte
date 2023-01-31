type MyIconProps = {
  icon: string;
  size: number;
  alt: string;
};

export const MyIcon: React.FC<MyIconProps> = ({
  icon,
  size,
  alt,
}: MyIconProps) => {
  return <img src={icon} width={size} height={size} alt={alt} />;
};
