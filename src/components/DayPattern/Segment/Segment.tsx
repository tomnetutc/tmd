import "./Segment.scss";
import { SegmentProps } from '../../../Types';


const Segment = (props: SegmentProps): JSX.Element => {
    const Icon = props.icon;
    return (
        <div className="widget">
            <div className="left">
                <span className="icon"><Icon /></span>
                <span className="title">{props.title}</span>
                <span className="counter">{props.counter}</span>
            </div>
        </div>

    )
}

export default Segment;