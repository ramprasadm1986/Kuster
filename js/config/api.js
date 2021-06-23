import Toast from 'react-native-simple-toast';

const baseurl = "http://kustersindia.net/api/Remote_v2/";
const staging="true";
const api = {
    user: baseurl + 'login?staging='+staging,
    opencall: baseurl + 'opencalls?staging='+staging,
    opencallsdata: baseurl + 'opencallsdata?staging='+staging,
    attendance: baseurl + 'attendance?staging='+staging,
    reuploadimage: baseurl + 'getreuploadimagecallids?staging='+staging,
    actual: baseurl + 'applyreimbursement?staging='+staging,
    actual_status: baseurl + 'reimbursebilldata?staging='+staging,
    amcs: baseurl + 'amcdata?staging='+staging
}


export default api;