import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { getFixedT } from "i18next";

import "../scss/UtilisateurManagement.scss";

import axiosInstance from "../services/axiosInstance";
import UtilisateurManagementList from "../pageComponents/utilisateurManagement/UtilisateurManagementList";
import ProfilePagePopUp from "../components/modals/ProfilePagePopUp";
import UtilisateurManagementUserInfo from "../pageComponents/utilisateurManagement/UtilisateurManagementUserInfo";
import UtilisateurManagementCreateUser from "../pageComponents/utilisateurManagement/UtilisateurManagementCreateUser";
import UtilisateurManagementBanUser from "../pageComponents/utilisateurManagement/UtilisateurManagementBanUser";
import UtilisateurManagementUnbanUser from "../pageComponents/utilisateurManagement/UtilisateurManagementUnbanUser";
import UseDeleteAccount from "../hooks/RQmutation/UseDeleteAccount";
import UtilisateurManagementDeleteAccount from "../pageComponents/utilisateurManagement/UtilisateurManagementDeleteAccount";
import splitArrayByObjectKeyValue from "../services/arrayMethods/splitArrayByObjectKeyValue";
import UseWarnUser from "../hooks/RQmutation/UseWarnUser";
import UtilisateurManagementWarnUser from "../pageComponents/utilisateurManagement/UtilisateurManagementWarnUser";
import UseCreateUser from "../hooks/RQmutation/UseCreateUser";
import UseUnwarnUser from "../hooks/RQmutation/UseUnwarnUser";

function UtilisateurManagement() {
  const [usersArray, setUsersArray] = useState([]);
  const [displayedComponents, setDisplayedComponents] = useState("default");
  const [selectedUser, setSelectedUser] = useState({});
  const [popUpState, setPopUpState] = useState({
    modalOpen: false,
    content: {},
  });
  const { t } = useTranslation([
    "common",
    "pageText",
    "errors",
    "popUpContent",
  ]);

  const queryclient = useQueryClient();

  /**
   * Set modal content then displays it.
   * @param {string} title - Title text displayed.
   * @param {string} message - Message text displayed.
   * @param {string} [validationBtnReturnedStr] - String read by the parent, leading to a callback.
   * @param {string} [validationBtnText] - Text displayed in confirmation button. No text equals to no button.
   * @param {boolean} [hasCloseBtn] - True if close button is rendered
   * @param {string} [closeBtnText=OK] - Text displayed in cancel/close button.
   * @function
   */
  const handleModalInstall = (
    title,
    message,
    validationBtnReturnedStr,
    validationBtnText,
    hasCloseBtn,
    closeBtnText
  ) => {
    setPopUpState({
      modalOpen: true,
      content: {
        title: title || t("errors:title.generic"),
        message: message || t("errors:message.generic"),
        button: {
          onValidation: validationBtnReturnedStr,
          text: validationBtnText,
        },
        hasCloseBtn,
        closeBtnText:
          closeBtnText || t("popUpContent:UtilisateurManagement.generic.close"),
      },
    });
  };

  const updateUsersQueryData = (newData) => {
    Object.freeze(newData);
    queryclient.setQueryData(["users"], newData);
  };

  const unwarnUserMutation = UseUnwarnUser(
    handleModalInstall,
    updateUsersQueryData
  );

  const unwarnUser = () => {
    const userInfos = {
      userId: selectedUser.id,
      userEmail: selectedUser.email,
    };

    return unwarnUserMutation.mutate(userInfos);
  };

  /**
   * Executed at modal closing: executes instruction if status is defined, then resets popUpState to undisplay modal
   * @param {string} [status] - String that indicates which function get used
   * @function
   */
  const handleCloseModal = (status) => {
    if (status === "backToUserList") {
      setDisplayedComponents("userListInfo");
    }
    if (status === "unbanUser") {
      setDisplayedComponents("unbanUser");
    }
    if (status === "warnUser") {
      setDisplayedComponents("warnUser");
    }
    if (status === "unwarnUser") {
      unwarnUser();
    }
    return setPopUpState({ modalOpen: false, content: {} });
  };

  const getUserListFromDb = async () => {
    const url = "api/users/";
    const res = await axiosInstance.get(url);
    return res.data;
  };

  const usersQuery = useQuery({
    queryKey: ["users"],
    queryFn: getUserListFromDb,
    // meta: {}
    throwOnError: true,
  });

  const newArrayWithBannedUser = (usersArr, userId) => {
    const idKey = "id";
    const userStateKey = "accountStatesId";
    const userStateValue = 3;
    const { matchingObjects, unmatchingObjects } = splitArrayByObjectKeyValue(
      usersArr,
      idKey,
      userId
    );
    const bannedUserObj = {
      ...matchingObjects[0],
      [userStateKey]: userStateValue,
    };
    unmatchingObjects.push(bannedUserObj);
    return unmatchingObjects;
  };

  const newArrayWithUnbannedUser = (usersArr, userId) => {
    const idKey = "id";
    const userStateKey = "accountStatesId";
    const userStateValue = 1;
    const { matchingObjects, unmatchingObjects } = splitArrayByObjectKeyValue(
      usersArr,
      idKey,
      userId
    );

    const unbannedUserObj = {
      ...matchingObjects[0],
      [userStateKey]: userStateValue,
    };
    unmatchingObjects.push(unbannedUserObj);
    return unmatchingObjects;
  };

  const addNewUserMutation = UseCreateUser(
    handleModalInstall,
    updateUsersQueryData
  );

  const banUser = () => {
    const postBan = async (formData) => {
      const sentData = { ...formData };
      let language = sentData.userLang;
      if (language !== "fr" || language !== "en") {
        language = "fr";
        Object.assign(sentData, {
          userLang: language,
        });
      }
      if (!sentData.messageToUser) {
        const fixedT = getFixedT(
          language,
          "pageText",
          "UtilisateurManagement.UM"
        );
        Object.assign(sentData, {
          messageToUser: fixedT("genericBanMsg"),
        });
      }
      queryclient.invalidateQueries("users");
      const res = await axiosInstance.post(`/api/users/banUser`, sentData);
      return res.data;
    };
    return useMutation({
      mutationFn: (values) => postBan(values),
      onError: (error) => {
        const translationPrefix = `popUpContent:UtilisateurManagement.${error.response.data.errorObj.message}.`;
        handleModalInstall(
          t(`${translationPrefix}title`),
          t(`${translationPrefix}message`),
          t(`${translationPrefix}validationBtnReturnedStr`),
          t(`${translationPrefix}validationBtnText`),
          true,
          t(`${translationPrefix}closeBtnText`)
        );
      },
      onSuccess: async (data, variables) => {
        const translationPrefix = `popUpContent:UtilisateurManagement.${data.successObj.message}.`;
        const users = await queryclient.getQueryData(["users"]);
        handleModalInstall(
          t(`${translationPrefix}title`),
          t(`${translationPrefix}message`),
          t(`${translationPrefix}validationBtnReturnedStr`),
          t(`${translationPrefix}validationBtnText`),
          false,
          t(`${translationPrefix}closeBtnText`)
        );
        const updatedUserList = newArrayWithBannedUser(users, variables.userId);
        return updateUsersQueryData(updatedUserList);
      },
    });
  };

  const banUserMutation = banUser();

  const unbanUser = () => {
    const postUnban = async (formData) => {
      const sentData = { ...formData };
      let language = sentData.userLang;
      if (language !== "fr" || language !== "en") {
        language = "fr";
        Object.assign(sentData, {
          userLang: language,
        });
      }
      if (!sentData.messageToUser) {
        const fixedT = getFixedT(
          language,
          "pageText",
          "UtilisateurManagement.UM"
        );
        Object.assign(sentData, {
          messageToUser: fixedT("genericUnbanMsg"),
        });
      }
      queryclient.invalidateQueries(["users"]);
      const res = await axiosInstance.post(`/api/users/unbanUser`, sentData);
      return res.data;
    };
    return useMutation({
      mutationFn: (values) => postUnban(values),
      onError: (error) => {
        const translationPrefix = `popUpContent:UtilisateurManagement.${error.response.data.errorObj.message}.`;
        handleModalInstall(
          t(`${translationPrefix}title`),
          t(`${translationPrefix}message`),
          t(`${translationPrefix}validationBtnReturnedStr`),
          t(`${translationPrefix}validationBtnText`),
          true,
          t(`${translationPrefix}closeBtnText`)
        );
      },
      onSuccess: (data, variables) => {
        const translationPrefix = `popUpContent:UtilisateurManagement.${data.successObj.message}.`;
        const users = queryclient.getQueryData(["users"]);
        handleModalInstall(
          t(`${translationPrefix}title`),
          t(`${translationPrefix}message`),
          t(`${translationPrefix}validationBtnReturnedStr`),
          t(`${translationPrefix}validationBtnText`),
          false,
          t(`${translationPrefix}closeBtnText`)
        );
        const updatedUserList = newArrayWithUnbannedUser(
          users,
          variables.userId
        );
        return updateUsersQueryData(updatedUserList);
      },
    });
  };
  const unbanUserMutation = unbanUser();

  const deleteAccountMutation = UseDeleteAccount(
    handleModalInstall,
    setUsersArray,
    updateUsersQueryData,
    splitArrayByObjectKeyValue
  );

  const handleUserSelected = (user) => {
    setDisplayedComponents("userListInfo");
    return setSelectedUser(user);
  };

  const createUser = () => {
    setDisplayedComponents("createUser");
    setSelectedUser({});
  };

  const giveSelectedUserData = (selectedUserId) => {
    if (selectedUserId && usersQuery.data) {
      const [userData] = splitArrayByObjectKeyValue(
        usersQuery.data,
        "userId",
        selectedUserId
      ).matchingObjects;
      return userData;
    }
    return null;
  };

  const warnUserMutation = UseWarnUser(
    handleModalInstall,
    setUsersArray,
    updateUsersQueryData
  );

  return (
    <div className="UtilisateurManagement">
      {displayedComponents === "default" ||
      displayedComponents === "userListInfo" ? (
        <>
          <button
            type="button"
            onClick={createUser}
            disabled={displayedComponents === "createUser"}
          >
            {t("pageText:UtilisateurManagement.UM.newUser")}
          </button>
          <p>{usersArray}</p>
          <UtilisateurManagementList
            userList={usersQuery.data}
            selectedUser={selectedUser}
            handleUserSelected={handleUserSelected}
          />
          {selectedUser?.userId ? (
            <UtilisateurManagementUserInfo
              key={selectedUser.userId}
              user={giveSelectedUserData(selectedUser.userId)}
              setDisplayedComponents={setDisplayedComponents}
              handleModalInstall={handleModalInstall}
            />
          ) : (
            ""
          )}
        </>
      ) : (
        ""
      )}
      {displayedComponents === "createUser" ? (
        <UtilisateurManagementCreateUser
          mutation={addNewUserMutation}
          setDisplayedComponents={setDisplayedComponents}
          handleModalInstall={handleModalInstall}
        />
      ) : (
        ""
      )}
      {displayedComponents === "warnUser" ? (
        <UtilisateurManagementWarnUser
          mutation={warnUserMutation}
          selectedUser={selectedUser}
          setDisplayedComponents={setDisplayedComponents}
          handleModalInstall={handleModalInstall}
        />
      ) : (
        ""
      )}
      {displayedComponents === "banUser" ? (
        <UtilisateurManagementBanUser
          mutation={banUserMutation}
          selectedUser={selectedUser}
          setDisplayedComponents={setDisplayedComponents}
          handleModalInstall={handleModalInstall}
        />
      ) : (
        ""
      )}
      {displayedComponents === "unbanUser" ? (
        <UtilisateurManagementUnbanUser
          mutation={unbanUserMutation}
          selectedUser={selectedUser}
          setDisplayedComponents={setDisplayedComponents}
          handleModalInstall={handleModalInstall}
        />
      ) : (
        ""
      )}
      {displayedComponents === "deleteAccount" ? (
        <UtilisateurManagementDeleteAccount
          mutation={deleteAccountMutation}
          selectedUser={selectedUser}
          setDisplayedComponents={setDisplayedComponents}
          handleModalInstall={handleModalInstall}
        />
      ) : (
        ""
      )}
      {popUpState.modalOpen ? (
        <ProfilePagePopUp
          isOpen={popUpState.modalOpen}
          content={popUpState.content}
          onClose={handleCloseModal}
        />
      ) : null}
    </div>
  );
}

export default UtilisateurManagement;
