import { OverlayLinkProps } from "../interfaces";

const OverlayLink: React.FC<OverlayLinkProps> = ({ href }: OverlayLinkProps): React.ReactElement => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className="absolute inset-0 z-30 bg-black/50 hover:bg-black/20 transition-colors duration-300"
  />
);

export default OverlayLink;
