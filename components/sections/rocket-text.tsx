import { MotionValue } from 'motion'
import { motion, useTransform, } from 'motion/react';
import { useEffect, useRef, useState } from 'react'

// const scrollProgressHandler = [
//   0, 0.05,    // Momento 1: 0 - 0.05
//   0.05, 0.09, // Momento 2: 0.05 - 0.09
//   0.09, 0.3,  // Momento 3: 0.09 - 0.3
//   0.3, 0.39,  // Momento 4: 0.3 - 0.39
//   0.39, 0.48, // Momento 5: 0.39 - 0.48
//   0.48, 0.59, // Momento 6: 0.48 - 0.59
//   0.59, 0.68, // Momento 7: 0.59 - 0.68
//   0.68, 0.79, // Momento 8: 0.68 - 0.79
//   0.79, 0.88, // Momento 9: 0.79 - 0.88
//   0.88, 1,    // Momento 10: 0.88 - 1
// ];


interface Props {
  scrollYProgress: MotionValue<number>;
  //callback que va a recibir la posicion del cohete


}

function RocketRext({ scrollYProgress, }: Props) {
  const rocketRef = useRef<HTMLSpanElement>(null);

  const [initialPos, setInitialPos] = useState<{ left: number; top: number } | null>(null)

  const [rocketWidth, setRocketWidth] = useState(0);
  const [rocketHeight, setRocketHeight] = useState(0);





  useEffect(() => {
    if (!rocketRef.current) return;

    const rect = rocketRef.current.getBoundingClientRect();

    setInitialPos({
      left: rect.left,
      top: rect.top,
    })

    setRocketWidth(rect.width);
    setRocketHeight(rect.height);

    // onRect?.({ left: rect.left, top: rect.top, width: rect.width, height: rect.height });
  }, []);

  // Final X (en PX)
  const finalX =
    typeof window !== "undefined" && initialPos !== null
      ? window.innerWidth - (initialPos.left + rocketWidth)
      : 0;

  // Final Y (en VH, hacia arriba: negativo)
  const finalYvh =
    typeof window !== "undefined" && initialPos !== null
      ? -(initialPos.top / window.innerHeight) * 100
      : 0;

  // Movimiento en X — más suave y con micro-transiciones
  const x = useTransform(
    scrollYProgress,
    // Momentos del scroll
    [0, 0.00000001, 0.18, 0.2, 0.25, 0.32, 0.4, 0.55, 0.7, 1],
    [
      "0px",                                // arranca quieto
      "-30px",
      `${finalX * 0.18}px`,                 // pequeño desvío inicial
      `${finalX * 0.22}px`,                 // último empujón hacia la derecha antes del giro
      `${finalX * 0.22}px`,                 // mantiene X estable mientras empieza a rotar
      `${finalX * 0.15}px`,                 // retrocede en X al comenzar el giro
      `${finalX * 0.05}px`,                 // retrocede más fuerte (fase de “ir hacia atrás”)
      `${finalX * 0.08}px`,                 // compensa un poquito para suavizar trayectoria
      `${finalX * 0.22}px`,                 // vuelve a alinearse para continuar recto
      `${finalX}px`,                        // pos final
    ]
  );


  // Movimiento en Y — coincidiendo con el giro, fluido y sin saltos
  const y = useTransform(
    scrollYProgress,
    [0, 0.18, 0.2, 0.25, 0.32, 0.4, 0.55, 0.7, 1],
    [
      "0vh",                                 // arranque
      `${finalYvh * 0.18}vh`,                // ascenso suave inicial
      `${finalYvh * 0.22}vh`,                // inclinación para iniciar el giro
      `${finalYvh * 0.28}vh`,                // sube un poco más mientras rota
      `${finalYvh * 0.32}vh`,                // primer punto de caída
      `${finalYvh * 0.28}vh`,                // baja más fuerte (retroceso + giro)
      `${finalYvh * 0.18}vh`,                // recuperación controlada
      `${finalYvh * 0.35}vh`,                // retoma trayectoria hacia arriba
      `${finalYvh}vh`,                       // destino final
    ]
  );


  // Escala — igual a lo que tenías
  const scale = useTransform(scrollYProgress, [0, 1], [1, 8]);


  // Giro — ahora con micro-puntos para transiciones suaves
  const rotate = useTransform(
    scrollYProgress,
    [0, 0.16, 0.18, 0.2, 0.24, 0.32, 0.6, 1],
    [
      0,                                        // sin giro
      0,                                        // estable
      -10,                                      // empieza a inclinarse
      -45,                                      // ángulo del giro
      -110,                                     // mitad del giro hacia atrás
      -180,                                     // da la vuelta completa hacia abajo
      -320,                                     // gira completo pero sin cambios de trayectoria
      -360                                      // estable
    ]
  );

  const xText = useTransform(scrollYProgress, [0.6, 1], ["0vw", "-100vw"]);

  const yText = useTransform(scrollYProgress, [0.6, 1], ["0vh", "10vh"]);
  const scaleText = useTransform(scrollYProgress, [0.6, 1], [1, 0.1]);

  const showImage = useTransform(
    scrollYProgress,
    [0, 0.00000001],
    [0, 1] // 0 = invisible, 1 = visible
  );

  const hideEmoji = useTransform(
    scrollYProgress,
    [0, 0.00000001],
    [1, 0] // emoji desaparece
  );


  return (




    <p className="text-start max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
      <motion.span
        style={{ x, y, rotate, scale, opacity: hideEmoji }}
        className="inline-block"
        ref={rocketRef}
      >
        🚀
      </motion.span>
      <motion.img
        src="/cohete.png"
        alt="cohete"
        className="inline-block absolute w-[30px] h-[30px] object-contain"
        style={{ x, y, rotate, scale, opacity: showImage }}
      />
      {" "}
      <motion.span
        style={{ x: xText, y: yText, scale: scaleText }}
        className="inline-block"
      >
        Vamos a construir algo juntos! 💡
      </motion.span>

    </p>


  )
}

export default RocketRext
