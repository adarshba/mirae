// UI-only shapes — store state contracts and prop bags. Not server-derived.

declare global {
  type CardState = {
    isHovered: boolean;
    cardId: number | string | null;
    position: { x: number; y: number };
    title: Title | null;
  };

  type ModalState = {
    titleId: number;
    isOpen: boolean;
    trailerId: string;
    titleData: TitleDetails | null;
    similarTitles: Title[];
    loadingSimilarTitles: boolean;
  };

  type PopupPosition = {
    x: number;
    y: number;
  };

  type SimilarCardProps = {
    id: number;
    title: string;
    description: string;
    imageUrl: string;
  };
}

export {};
