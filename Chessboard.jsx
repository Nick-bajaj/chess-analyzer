import React from 'react';
import { Chessboard } from 'react-chessboard';

function ChessBoardComponent({ fen, onMove }) {
     const onPieceDrop = (sourceSquare, targetSquare) => {
         if(onMove){
            onMove(sourceSquare, targetSquare)
         }
       }

    return (
       <Chessboard
            position={fen}
            onPieceDrop={onPieceDrop}
            boardWidth={400}
          />
      );
    }
export default ChessBoardComponent;