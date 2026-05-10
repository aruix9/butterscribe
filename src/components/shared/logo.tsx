import Image from 'next/image'
import Link from 'next/link'

const Logo = ({className}: {className?: string}) => {
  return (
    <Link href='/' className={className}>
      <Image
        src='/images/6s-logo.png'
        width={115}
        height={39}
        className='object-cover'
        alt='Butterscribe'
      />
    </Link>
  )
}

export default Logo
