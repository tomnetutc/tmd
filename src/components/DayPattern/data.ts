import PeopleAltOutlinedIcon from '@mui/icons-material/PeopleAltOutlined';
import SignalCellularAltOutlinedIcon from '@mui/icons-material/SignalCellularAltOutlined';
import RestoreOutlinedIcon from '@mui/icons-material/RestoreOutlined';
import EventAvailableOutlinedIcon from '@mui/icons-material/EventAvailableOutlined';
import ModeOfTravelIcon from '@mui/icons-material/ModeOfTravel';

export let segmentSizing = {
    title: "Segment size",
    counter: "",
    icon: PeopleAltOutlinedIcon

}

export let segmentShare = {
    title: "Share in the sample",
    counter: "",
    icon: SignalCellularAltOutlinedIcon
}

export let segmentTripChains = {
    title: "Total number of trip chains",
    counter: "",
    icon: ModeOfTravelIcon
}

export const updateSegmentSize = (newCounter: number) => {
    segmentSizing = { ...segmentSizing, counter: `N= ${newCounter.toLocaleString()} persons` };
};

export const updateSegmentShare = (row1: number, row2: number) => {
    const share = (row1 / row2) * 100;
    const formatedSegmentShare = (share < 1 && share != 0) ? share.toFixed(2) : share.toFixed(1);
    segmentShare = { ...segmentShare, counter: `${formatedSegmentShare} %` };
};


export const updateSegmentTripChains = (newCounter: number) => {
    segmentTripChains = { ...segmentTripChains, counter: `N= ${newCounter.toLocaleString()} chains` };
}

