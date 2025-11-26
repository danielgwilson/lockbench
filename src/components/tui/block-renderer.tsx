import React from 'react';

// --- RENDERER ---
// Renders 2 vertical pixels per character using the "Lower Half Block" (▄).
// Uses CSS Grid to create the 1px separation lines requested.
export const BlockRenderer = ({ grid, width }: { grid: number[], width: number }) => {
  const height = grid.length / width;
  
  // We render 1 cell for every 2 vertical pixels
  const cells = [];
  for (let y = 0; y < height; y += 2) {
    for (let x = 0; x < width; x++) {
      const topIndex = y * width + x;
      const bottomIndex = (y + 1) * width + x;
      
      const topColorId = grid[topIndex];
      const bottomColorId = grid[bottomIndex] !== undefined ? grid[bottomIndex] : 0; // Default to BG if odd height

      cells.push({
        topId: topColorId,
        bottomId: bottomColorId,
        key: `${x}-${y}`
      });
    }
  }

  const PALETTE = {
    0: '#595755', // Zinc-800 (Background/Grid)
    1: '#CBCAC4', // Zinc-50 (Pale Gray)
    2: '#A7A7A3', // Zinc-200 (Light Gray)
    3: '#898780', // Zinc-400 (Medium Gray)
    4: '#565450', // Zinc-600 (Dark Gray)
    5: '#201E1B', // Zinc-950 (Black)
  };

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: `repeat(${width}, 1fr)`,
      gap: '1px',
      backgroundColor: '#000', // Black background shows through gaps to create lines
      padding: '1px', // Outer border effect
      width: '100%',
      fontFamily: '"Fira Code", monospace',
      lineHeight: 1,
      userSelect: 'none',
    }}>
      {cells.map((cell) => (
        <div 
          key={cell.key}
          style={{
            backgroundColor: PALETTE[cell.topId as keyof typeof PALETTE], // Top half color
            color: PALETTE[cell.bottomId as keyof typeof PALETTE],       // Bottom half color
            width: '100%',
            aspectRatio: '4/9', // 8px / 18px = 0.444...
            display: 'flex',
            alignItems: 'flex-end', // Align the half-block character to bottom
            justifyContent: 'center',
            overflow: 'hidden'
          }}
        >
          <span style={{ 
            display: 'block', 
            height: '50%', // The character ▄ covers the bottom 50% visually usually, but explicit height helps
            width: '100%',
            backgroundColor: 'currentColor', // Use the text color for the "block"
          }} /> 
          {/* 
             Note: Using a span with bg color instead of text character '▄' 
             gives us perfect pixel control without font rendering artifacts/gaps.
             Top half is the parent div's background.
             Bottom half is this span.
          */}
        </div>
      ))}
    </div>
  );
};
