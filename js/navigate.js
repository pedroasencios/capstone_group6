// Javascript Document

function navigateFoward(getPage) {
    $('#page-'+intCurrentPage).hide();
    $('#page-'+getPage).show();
    navArray.push(intCurrentPage);
    intCurrentPage = getPage;

}

function navigateBackward() {
    var strNavBack = navArray.pop();

    $('#page-'+intCurrentPage).hide();
    $('#page-'+strNavBack).show();

    intCurrentPage = strNavBack;
}