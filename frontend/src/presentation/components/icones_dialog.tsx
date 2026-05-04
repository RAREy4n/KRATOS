// src/presentation/components/icones_dialog.tsx
interface AvatarData {
  src: string;
  alt: string;
}

interface IconesDialogProps {
  aberto: boolean;
  onFechar: () => void;
  onSelecionar: (indice: number) => void;
  onConfirmar: () => void;
  avatares: AvatarData[]; // 👈 agora um array de objetos
  selecionado: number;
}

export default function IconesDialog({
  aberto,
  onFechar,
  onSelecionar,
  onConfirmar,
  avatares,
  selecionado,
}: IconesDialogProps) {
  if (!aberto) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay escuro – cancela */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onFechar}
      />

      <div className="relative bg-brand-cardBg rounded-[30px] p-6 shadow-2xl border-[3px] border-[#D6E2C6]/50 w-[90%] max-w-[400px]">
        <h3 className="text-2xl font-bold text-brand-textDark text-center mb-4">
          Escolha seu avatar
        </h3>

        <div className="grid grid-cols-4 gap-3 justify-items-center">
          {avatares.map((avatar, index) => (
            <button
              key={index}
              type="button"
              onClick={() => onSelecionar(index)}
              className={`w-16 h-16 rounded-full flex items-center justify-center p-1 transition-all border-2 ${
                index === selecionado
                  ? 'border-brand-btnBorder bg-brand-btnBg scale-110 shadow-md'
                  : 'border-transparent bg-white/80 hover:bg-white hover:scale-105'
              }`}
            >
              <img
                src={avatar.src}
                alt={avatar.alt || 'Avatar'}
                className="w-full h-full object-contain rounded-full"
              />
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={onConfirmar}
          className="mt-6 w-full bg-brand-btnBg text-white font-bold py-2 rounded-full hover:bg-[#7da02b] transition-colors"
        >
          Confirmar
        </button>
      </div>
    </div>
  );
}