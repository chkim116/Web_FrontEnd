import { useFormInput, useToggle } from "@cooksmelon/event";
import WriteReviewForm from "components/write/writeReview/WriteReviewForm";
import { useScrollTop } from "hook";
import { useRouter } from "next/dist/client/router";
import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "redux";
import { reviewWrite } from "redux/review";
import Select from "react-select";

const Review = () => {
    const router = useRouter();
    const dispatch = useDispatch();
    const writeReview = useSelector((state: RootState) => state.review.write);
    const { isSell } = useSelector((state: RootState) => state.review);

    // 폼을 작성합니다.
    const [form, handleFormChange, setForm] = useFormInput();

    // 방을 내놓은 버튼 토글
    const [toggle, handleToggle] = useToggle(isSell);

    // 유지 기간
    const { durationStart, durationEnd } = writeReview;
    const handleStartDate = useCallback(
        (data: Date) => {
            setForm({ ...form, durationStart: data });
        },
        [dispatch]
    );

    const handleFinishDate = useCallback(
        (data: Date) => {
            setForm({ ...form, durationEnd: data });
        },
        [dispatch]
    );

    // 폼을 리덕스에 저장합니다.
    useEffect(() => {
        dispatch(
            reviewWrite({
                ...writeReview,
                ...form,
                isSell: toggle,
            })
        );
    }, [form]);

    // 만약 방을 내놓으면, isSell에 상태를 저장합니다
    useEffect(() => {
        dispatch(
            reviewWrite({
                ...writeReview,
                isSell: toggle,
            })
        );
    }, [toggle]);

    // 폼을 제출합니다.
    const handleSubmit = useCallback(
        (e: React.FormEvent<HTMLButtonElement | HTMLFormElement>) => {
            e.preventDefault();
            if (window.confirm("작성 하십니까?")) {
                console.log(writeReview);
            }
        },
        []
    );

    // 이전 단계로 이동합니다.
    const handlePrev = useCallback(() => {
        router.back();
    }, []);

    // 렌더링 시 맨 위로 이동
    useScrollTop();

    return (
        <WriteReviewForm
            toggle={isSell}
            writeReview={writeReview}
            durationStart={durationStart}
            durationEnd={durationEnd}
            handleFinishDate={handleFinishDate}
            handleStartDate={handleStartDate}
            handleToggle={handleToggle}
            handleFormChange={handleFormChange}
            handleSubmit={handleSubmit}
            handlePrev={handlePrev}
        ></WriteReviewForm>
    );
};

export default Review;