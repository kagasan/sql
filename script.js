var tableNumber = 0;
$(function() {
    new ClipboardJS('.btn-clipboard');

    $("#generate").on('click', function() {
        generateCode();
    });
    $("#delete-copy").on('click', function() {
        copyDeleteCode();
    });
    $("#create-copy").on('click', function() {
        copyCreateCode();
    });
    $("#table-minus").on('click', function() {
        table_minus();
    });
    $("#table-plus").on('click', function() {
        table_plus();
    });

    $(".code-copy").on('click', function() {
        $(this).parent().find("span").text("コピーしました！");
    });

    init();
});

function init() {
    table_plus();
}

function addRow(tableId) {
    const $table = $(`div[tableid=${tableId}]`).find("table");
    const rows = parseInt($table.attr("rows"));
    const cols = parseInt($table.attr("cols"));
    let str = '';
    str += '<tr class="table-body">';
    str += `<td>${rows + 1}</td>`;
    for (let x = 1; x <= cols; x++) {
        str += `<td x="${x}" y="${rows + 1}"><div class="px-3"><input type="text" class="form-control my-3"></div></td>`;
    }
    str += '</tr>';
    $table.append(str);
    $(`div[tableid=${tableId}]`).find("table").attr("rows", "" + (rows + 1));
}
function removeRow(tableId) {
    const $table = $(`div[tableid=${tableId}]`).find("table");
    const rows = parseInt($table.attr("rows"));
    const cols = parseInt($table.attr("cols"));
    if (rows > 0) {
        $table.find("tr").last().remove();
        $table.attr("rows", "" + (rows - 1));
    }
}

function addCol(tableId) {
    const $table = $(`div[tableid=${tableId}]`).find("table");
    const rows = parseInt($table.attr("rows"));
    const cols = parseInt($table.attr("cols"));
    const $tr = $(`div[tableid=${tableId}]`).find("table").find("tr");
    for (let y = 0; y <= rows; y++) {
        if(y === 0) {
            let th = '';
            th += `<th x="${cols + 1}" y="${y}">`;
            th += '<div class="px-3">';
            th += `<input type="text" class="form-control my-3" value="col${cols + 1}">`;

            th += `<select id="select${tableId}-${cols + 1}" class="form-control my-3">`;
            th += `<option>INT</option>`;
            th += `<option>VARCHAR(10)</option>`;
            th += `</select>`;
            th += '</div>';
            th += `</th>`;
            $(th).appendTo($tr.get(y));
        } else {
            $(`<td x="${cols + 1}" y="${y}"></td>`).appendTo($tr.get(y));
        }
    }
    const $tr2 = $(`div[tableid=${tableId}]`).find("table").find("tr");
    for (let y = 1; y <= rows; y++) {
        $($tr2.get(y)).find("td").last().html('<div class="px-3"><input type="text" class="form-control my-3"></div>');
    }
    $(`div[tableid=${tableId}]`).find("table").attr("cols", "" + (cols + 1));
}
function removeCol(tableId) {
    const $table = $(`div[tableid=${tableId}]`).find("table");
    const rows = parseInt($table.attr("rows"));
    const cols = parseInt($table.attr("cols"));
    const $tr = $(`div[tableid=${tableId}]`).find("table").find("tr");

    if (cols > 0) {
        for (let y = 0; y <= rows; y++) {
            if(y === 0) {
                $($tr.get(y)).find("th").last().remove();
            } else {
                $($tr.get(y)).find("td").last().remove();
            }        
        }
        $(`div[tableid=${tableId}]`).find("table").attr("cols", "" + (cols - 1));
    }

}

function table_plus() {
    tableNumber++;
    let str = '';
    str += `<div class="card db-table-div mt-3" tableid="${tableNumber}">`;
    str += '<div class="card-header">';
    
    str += '<div class="form-group form-inline">';
    str += '<span>テーブル名</span>';
    str += `<input type="text" class="form-control table-name" value="sample_table${tableNumber}">`;
    str += '</div>';

    str += '</div>';
    str += '<div class="card-body">';
    str += ` <button type="button" class="btn btn-sm btn-info add-row" tableid="${tableNumber}">行追加<i class="fas fa-arrow-down"></i></button>`;
    str += ` <button type="button" class="btn btn-sm btn-info remove-row" tableid="${tableNumber}">行削除<i class="fas fa-arrow-up"></i></button>`;
    str += ` <button type="button" class="btn btn-sm btn-info add-col" tableid="${tableNumber}">列追加<i class="fas fa-arrow-right"></i></button>`;
    str += ` <button type="button" class="btn btn-sm btn-info remove-col" tableid="${tableNumber}">列削除<i class="fas fa-arrow-left"></i></button>`;
    str += '<table class="db-table mt-3" border="1" rows="0" cols="0">';
    str += '<tr class="table-head"><th></th></tr>';
    str += '</table>';
    str += '</div>';
    str += '</div>';
    $("#tables").append(str);
    const table_count = $("#tables .card").length;
    $("#table_count").text(`テーブル数 : ${table_count}`);
    const id = toString(tableNumber);
    $(`div[tableid=${tableNumber}] .add-row`).on('click', function() {
        addRow($(this).attr("tableid"));
    });
    $(`div[tableid=${tableNumber}] .remove-row`).on('click', function() {
        removeRow($(this).attr("tableid"));
    });
    $(`div[tableid=${tableNumber}] .add-col`).on('click', function() {
        addCol($(this).attr("tableid"));
    });
    $(`div[tableid=${tableNumber}] .remove-col`).on('click', function() {
        removeCol($(this).attr("tableid"));
    });
    $(`div[tableid=${tableNumber}] .add-row`).click();
    $(`div[tableid=${tableNumber}] .add-col`).click();
}

function table_minus() {
    if ($("#tables .card").length > 0) {
        $("#tables .card").last().remove();
    }
    const table_count = $("#tables .card").length;
    $("#table_count").text(`テーブル数 : ${table_count}`);
}

function copyDeleteCode() {
    $("#delete-copy-message").text("コピーしました");
}

function copyCreateCode() {
    
    $("#create-copy-message").text("コピーしました");
}

function generateCode() {
    generateDeleteCode($("#db-name").val());
    generateCreateCode($("#db-name").val());
    $("#delete-copy-message").text("");
    $("#create-copy-message").text("");
}

function generateDeleteCode(dbName) {
    let str = "DROP DATABASE IF EXISTS " + dbName + ";\n";
    $("#result-delete").text(str);
}

function generateCreateCode(dbName) {
    let str = "DROP DATABASE IF EXISTS " + dbName + ";\n";
    str += "CREATE DATABASE " + dbName + ";\n";
    str += "USE " + dbName + ";\n";

    const $tables = $("#tables .card");
    const tableNames = [];
    const names = [];
    const types = [];
    for (let i = 0; i < $tables.length; i++) {
        tableNames.push($($tables.get(i)).find(".table-name").val());
        const type = [];
        const name = [];
        str += "CREATE TABLE ";
        str += $($tables.get(i)).find(".table-name").val();
        str += " (";
        $th = $($tables.get(i)).find(".table-head").find("th");
        for (let j = 1; j < $th.length; j++) {
            const colName = $($th.get(j)).find("input").val();
            const colType = $($th.get(j)).find("select").val();
            if(j > 1)str += ", ";
            str += colName + " " + colType;
            name.push(colName);
            type.push(colType);
        }
        str += ");\n";
        types.push(type);
        names.push(name);
    }
    for (let i = 0; i < $tables.length; i++) {
        const $tr = $($tables.get(i)).find(".table-body");
        for (let j = 0; j < $tr.length; j++) {
            str += "INSERT INTO ";
            str += $($tables.get(i)).find(".table-name").val();
            str += " VALUES("
            const $td = $($tr.get(j)).find("td");
            for (let k = 1; k < $td.length; k++) {
                if (k > 1)str += ", ";
                const val = $($td.get(k)).find("input").val();
                if (types[i][k - 1] === 'VARCHAR(10)') {
                    str += `'${val}'`;
                } else if (types[i][k - 1] === 'INT') {
                    str += parseInt(val);                    
                } else {
                    str += "NULL";
                }
            }
            str += ");\n";
        }
    }
    for (let i = 0; i < $tables.length; i++) {
        str += "SELECT * FROM ";
        str += $($tables.get(i)).find(".table-name").val();
        str += " LIMIT 0, 10;\n";
    }
    $("#result-create").text(str);

    $("#check-list").empty();
    let checkCount = 0;
    function addJoinON(tableA, colA, tableB, colB) {
        checkCount++;
        let checkStr = '';
        checkStr += `<li class="list-group-item">`;
        checkStr += `<h5>${tableA} と ${tableB} で ${colA} が一致しました。</h5>`;
        checkStr += `<button type="button" class="btn btn-secondary btn-sm check-clipboard" data-clipboard-target="#check-${checkCount}">コピー</button>`;
        checkStr += `<span></span>`;
        checkStr += `<textarea class="form-control" id="check-${checkCount}">SELECT * FROM ${tableA} JOIN ${tableB} ON ${tableA}.${colA} = ${tableB}.${colB};\n</textarea>`;
        checkStr += `</li>`;
        $("#check-list").append(checkStr);
    }
    for (let i = 0; i < tableNames.length; i++) {
        for (let j = i + 1; j < tableNames.length; j++) {
            const tableA = tableNames[i];
            const tableB = tableNames[j];
            for (let k = 0; k < names[i].length; k++) {
                for (let l = 0; l < names[j].length; l++) {
                    const colA = names[i][k];
                    const colB = names[j][l];
                    const typeA = types[i][k];
                    const typeB = types[j][l];
                    if (colA === colB && typeA === typeB) {
                        addJoinON(tableA, colA, tableB, colB);
                    }
                }
            }
        }
    }
    new ClipboardJS('.check-clipboard');
    $(".check-clipboard").on('click', function() {
        $(this).parent().find("span").text("コピーしました");
    });

    if (checkCount === 0) {
        let checkMessage = '';
        checkMessage += '<li class="list-group-item">';
        checkMessage += '<h5>カラムが一致するテーブルは見つかりませんでした。</h5>';
        checkMessage += '</li>';
        $("#check-list").append(checkMessage);
    }
}
