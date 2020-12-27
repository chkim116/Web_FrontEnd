//회원가입에 대한 사가.
import { all, fork, takeLatest, put, call } from "redux-saga/effects";
import {
    isMemberCheckReq,
    isMemberYes,
    isMemberNo,
    isMemberCheckFail,
    idDoubleCheckReq,
    idDoubleYes,
    idDoubleNo,
    idDoubleCheckFail,
    emailVerifyReq,
    emailVerifySuccess,
    emailVerifyFail,
} from "Redux/SignUp";
import {
    preferenceWrite,
    setNameAndPhone,
    setId,
    setPassWord,
    setEmail,
    user,
} from "Redux/user";
import axios from "axios";

const Domain: String = "http://jjaggutrace.com";

// 기존 회원 여부 체크 요청(get)
function memberCheckGet(userData: { name: string; phoneNum: string }) {
    return axios.get(
        `${Domain}/api/v1/auth/registered?name=${userData.name}&phoneNum=${userData.phoneNum}`
    );
}
// 아이디 중복 확인(get)
function idDoubleGet(id: string) {
    return axios.get(`${Domain}/api/v1/auth/registered?userId=${id}`);
}

// 이메일 인증(get)
function emailVerify(email: string) {
    return axios.get(`${Domain}/api/v1/mail/verification?mail=${email}`);
}

// 기존 회원가입 여부 판단 사가
function* nameAndPhoneSaga({ payload }: any) {
    console.log(payload);
    try {
        const res = yield call(memberCheckGet, payload);
        console.log(res);
        // 응답이 오면 그 응답에 맞게 필터링.
        // if (res) {
        //     // 멤버가 아니면 유저 상태에 값 업데이트
        //     yield put(isMemberNo());
        //     yield put(setNameAndPhone(payload));
        // } else {
        //     yield put(isMemberYes());
        // }
    } catch (error) {
        console.log(error);
        yield put(isMemberCheckFail(error));
    }
}

// 아이디 중복 여부 판단 사가
function* idDoubleCheckSaga({ payload }: any) {
    try {
        const res = yield call(idDoubleGet, payload);
        if (res) {
            // 중복이 안되면
            yield put(idDoubleNo());
            yield put(setId(payload));
        } else {
            yield put(idDoubleYes());
        }
    } catch (error) {
        console.log(error);
        yield put(idDoubleCheckFail(error));
    }
}

// 이메일 인증 사가

function* emailCheckSaga({ payload }: any) {
    try {
        const {
            data: { verificationKey },
        } = yield call(emailVerify, payload);
        yield put(emailVerifySuccess(verificationKey));
    } catch (error) {
        console.log(error);
        yield emailVerifyFail(error);
    }
}

// 기존 회원인지 아닌지 계속 watch
function* watchsetNameAndPhoneSaga() {
    yield takeLatest(isMemberCheckReq, nameAndPhoneSaga);
}
// 아이디 중복 여부 계속 watch
function* watchIdDoubleCheckSaga() {
    yield takeLatest(idDoubleCheckReq, idDoubleCheckSaga);
}

// 이메일 리퀘스트 watch
function* watchEmailCheckSaga() {
    yield takeLatest(emailVerifyReq, emailCheckSaga);
}

////////////////////////////////////////////////////////////////////////////////////////////////////////

export default function* SignUpSaga(): Generator {
    yield all([
        fork(watchsetNameAndPhoneSaga),
        fork(watchIdDoubleCheckSaga),
        fork(watchEmailCheckSaga),
    ]);
}
