import { IconButton } from '@mui/material';
import { ArrowForwardIos, ArrowBackIos } from '@mui/icons-material';

interface ArrowProps {
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
}

/**
 * Slider navigation arrows extracted from ItemView so the main component
 * stays lean. They simply proxy Slick's `onClick` callback and apply the
 * same styling for both directions.
 */
export const NextArrow: React.FC<ArrowProps> = ({ onClick }) => {
  return (
    <IconButton
      onClick={onClick}
      sx={{
        position: 'absolute',
        right: 10,
        top: '50%',
        transform: 'translateY(-50%)',
        zIndex: 1,
        bgcolor: 'rgba(255, 255, 255, 0.8)',
        '&:hover': {
          bgcolor: 'rgba(255, 255, 255, 0.9)',
        },
      }}
    >
      <ArrowForwardIos />
    </IconButton>
  );
};

export const PrevArrow: React.FC<ArrowProps> = ({ onClick }) => {
  return (
    <IconButton
      onClick={onClick}
      sx={{
        position: 'absolute',
        left: 10,
        top: '50%',
        transform: 'translateY(-50%)',
        zIndex: 1,
        bgcolor: 'rgba(255, 255, 255, 0.8)',
        '&:hover': {
          bgcolor: 'rgba(255, 255, 255, 0.9)',
        },
      }}
    >
      <ArrowBackIos />
    </IconButton>
  );
};
