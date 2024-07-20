import './CorrectedSVG.scss'
import { ReactSVG } from "react-svg"

type Props = {
    src: string
}

/**
 * Used to correct the alignment of the contained SVG not working properly in the ReactSVG component
 */
export default function CorrectedSVG(props: Props) {
    const { src } = props

    return (
        <div className="corrected-svg">
            <ReactSVG src={src} />
        </div>
    )
}