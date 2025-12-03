import React from 'react'
import { TextAnimate } from '../magicui/text-animate'
import Link from 'next/link'
import ButtonIcon from './button-icon'
import { SiGithub, SiLinkedin } from 'react-icons/si'
import { MotionValue, motion, useTransform } from 'motion/react'

interface Props {
  scrollYProgress: MotionValue<number>;
  rocketText: React.ReactNode;

}


function HeroText({ rocketText, scrollYProgress }: Props) {

  const x = useTransform(scrollYProgress, [0.6, 1], ["0vw", "-100vw"]);
  const xImg = useTransform(scrollYProgress, [0.6, 1], ["0px", "-170vw"]);
  const y = useTransform(scrollYProgress, [0.6, 1], ["0vh", "10vh"]);
  const scale = useTransform(scrollYProgress, [0.6, 1], [1, 0.1]);

  return (
    <div className="flex max-[990px]:flex-col-reverse">
      <div>


        <motion.div
          style={{ x, y, scale }}

        >
          <TextAnimate className="uppercase font-bold line leading-3 text-[14px] md:text-[21px] text-left">
            Hola soy Valentín Zoia
          </TextAnimate>
          <TextAnimate
            className="  font-bold tracking-tighter text-left text-[4.2rem] leading-[1.05] sm:text-[8.5rem]"
            animation="slideUp"
            by="word"
          >
            Full Stack Developer
          </TextAnimate>
        </motion.div>
        {rocketText}


        <motion.div
          style={{ x, y, }}

        >



          <div className="flex mt-5 space-x-4 text-start">
            <Link
              href="https://github.com/ValentinZoia"
              target="_blank"
            >
              <ButtonIcon
                icon={<SiGithub className="h-4 w-4" />}
              />



            </Link>
            <Link
              href="https://www.linkedin.com/in/valentín-zoia/"
              target="_blank"
            >
              <ButtonIcon
                icon={<SiLinkedin className="h-4 w-4" />}
              />

            </Link>
          </div>
        </motion.div>
      </div>



      <motion.img
        style={{ x: xImg, y, scale }}
        src={`https://github.com/${process.env.NEXT_PUBLIC_GITHUB_PERFIL}.png`}
        alt=""
        className="rounded-full w-[20rem] h-80 max-[990px]:mb-5"

      />

    </div>
  )
}

export default HeroText
